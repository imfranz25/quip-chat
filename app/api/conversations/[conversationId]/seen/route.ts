import { NextResponse } from 'next/server';

import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';
import { pusherServer } from '@/app/libs/pusherSocket';

interface IParams {
  conversationId: string;
}

export const POST = async (
  _request: Request,
  { params }: { params: IParams },
) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.email || !currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { conversationId } = params;

    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    });

    if (!existingConversation) {
      return new NextResponse('Conversation not found', { status: 404 });
    }

    const lastIndex = existingConversation.messages.length - 1;
    const lastMessage = existingConversation.messages[lastIndex];

    if (!lastMessage) {
      return NextResponse.json(existingConversation);
    }

    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id,
      },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    await pusherServer.trigger(currentUser.email, 'conversation:update', {
      id: conversationId,
      messages: updatedMessage,
    });

    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
      return NextResponse.json(existingConversation);
    }

    await pusherServer.trigger(
      conversationId,
      'messages:update',
      updatedMessage,
    );

    return NextResponse.json(updatedMessage);
  } catch (error: unknown) {
    console.error(error, 'ERROR SEEN');
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};

import { NextResponse } from 'next/server';

import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';

export const Post = async (request: Request) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.email || !currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { message, image, conversationId } = await request.json();

    const newMessage = await prisma.message.create({
      data: {
        image,
        body: message,
        conversation: {
          connect: {
            id: conversationId,
          },
        },
        sender: {
          connect: {
            id: currentUser.id,
          },
        },
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      include: {
        seen: true,
        sender: true,
      },
    });

    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });

    console.log({ updatedConversation });

    return NextResponse.json(newMessage);
  } catch (error: unknown) {
    console.error(error, 'Error Message');
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};

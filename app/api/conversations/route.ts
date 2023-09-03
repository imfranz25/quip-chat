import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';
import { pusherServer } from '@/app/libs/pusherSocket';

export const POST = async (request: NextRequest) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { userId, isGroup, members, name } = await request.json();

    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse('Invalid payload', { status: 400 });
    }

    if (isGroup) {
      const newGroupConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              { id: currentUser.id },
            ],
          },
        },
        include: {
          users: true,
        },
      });

      newGroupConversation.users.forEach((user) => {
        if (user.email) {
          pusherServer.trigger(
            user.email,
            'conversation:new',
            newGroupConversation,
          );
        }
      });

      return NextResponse.json(newGroupConversation);
    }

    const [existingConversation] = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    });

    if (existingConversation) {
      return NextResponse.json(existingConversation);
    }

    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [{ id: currentUser.id }, { id: userId }],
        },
      },
      include: {
        users: true,
      },
    });

    newConversation.users.map((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, 'conversation:new', newConversation);
      }
    });

    return NextResponse.json(newConversation);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};

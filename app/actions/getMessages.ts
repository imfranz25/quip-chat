import prisma from '@/app/libs/prismadb';
import getCurrentUser from './getCurrentUser';

const getMessages = async (conversationId: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.email) {
      return [];
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      include: {
        seen: true,
        sender: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return messages;
  } catch (error) {
    return [];
  }
};

export default getMessages;

import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';

export const POST = async (request: Request) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.email || !currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { name, image } = await request.json();
    const newData = { name } as { name: string; image?: string };

    if (image) {
      newData.image = image;
    }

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: newData,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Settings Error', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};

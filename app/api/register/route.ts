import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { email, name, password, confirmPassword } = body;

    if (!email || !name || !password) {
      return new NextResponse('Missing info', { status: 400 });
    }

    if (password !== confirmPassword) {
      return new NextResponse('Password and confirm password does not match!', {
        status: 422,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });

    return NextResponse.json(user);
  } catch (error: unknown) {
    console.error('REGISTRATION_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};

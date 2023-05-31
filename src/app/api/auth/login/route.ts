import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import db from '@/lib/prisma';

export type LoginCredentials = {
  email: string;
  password: string;
};

const loginCredentialsSchema: z.ZodType<LoginCredentials> = z.object({
  email: z.string().min(1),
  password: z.string().min(1)
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const { email, password } = await loginCredentialsSchema.parseAsync(body);

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return new NextResponse('Invalid Credentials', { status: 401 });
    }

    const isCorrectPassword = await bcrypt.compare(password, user.hashedPassword);
    if (!isCorrectPassword) {
      return new NextResponse('Invalid Credentials', { status: 401 });
    }
    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error }, { status: 400 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

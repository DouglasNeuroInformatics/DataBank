import { type Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import db from '@/lib/prisma';

type CreateUserData = Omit<Prisma.UserCreateInput, 'hashedPassword'> & {
  password: string;
};

const createUserSchema: z.ZodType<CreateUserData> = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1)
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const { email, password, ...rest } = await createUserSchema.parseAsync(body);

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return new NextResponse('User with provided email already exists', { status: 409 });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const { id, firstName, lastName } = await db.user.create({ data: { email, hashedPassword, ...rest } });
    return NextResponse.json({ id, firstName, lastName, email, password });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error }, { status: 400 });
    }
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

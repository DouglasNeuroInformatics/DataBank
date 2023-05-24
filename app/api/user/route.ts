import { NextRequest, NextResponse } from 'next/server';

import bcrypt from 'bcrypt';

import prisma from '@/lib/prisma';

interface RequestBody {
  username: string;
  password: string;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as RequestBody;
  const hashedPassword = await bcrypt.hash(body.password, 10);

  const user = await prisma.user.create({
    data: {
      username: body.username,
      password: hashedPassword
    }
  });

  return NextResponse.json({ username: user.username });
}

import { NextRequest, NextResponse } from 'next/server';

import bcrypt from 'bcrypt';

import prisma from '@/lib/prisma';

interface RequestBody {
  username: string;
  password: string;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as RequestBody;
  const user = await prisma.user.findFirst({
    where: {
      username: body.username
    }
  });

  const isAuthenticated = user && bcrypt.compareSync(body.password, user.password);

  if (isAuthenticated) {
    return NextResponse.json({ username: user.username });
  }
  return NextResponse.json(null);
}

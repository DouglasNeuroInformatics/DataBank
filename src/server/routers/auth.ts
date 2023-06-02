import 'server-only';

import { TRPCError } from '@trpc/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import { prisma } from '../prisma';
import { publicProcedure, router } from '../trpc';

const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error('Secret key is not defined!');
}

const login = publicProcedure
  .input(
    z.object({
      email: z.string().min(1),
      password: z.string().min(1)
    })
  )
  .mutation(async ({ input, ctx }) => {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    const isCorrectPassword = await bcrypt.compare(input.password, user.hashedPassword);
    if (!isCorrectPassword) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    const accessToken = jwt.sign(user, SECRET_KEY);
    ctx.setAccessToken(accessToken);
    return { success: true };
  });

export const authRouter = router({ login });

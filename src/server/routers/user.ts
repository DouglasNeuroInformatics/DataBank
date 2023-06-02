import { TRPCError } from '@trpc/server';
import bcrypt from 'bcrypt';
import { z } from 'zod';

import { prisma } from '../prisma';
import { adminProcedure, publicProcedure, router } from '../trpc';

const createUser = publicProcedure
  .input(
    z.object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      email: z.string().email(),
      password: z.string().min(1)
    })
  )
  .mutation(async ({ input }) => {
    const { email, password, ...rest } = input;
    const existingUser = await prisma.user.findUnique({ where: { email: email } });
    if (existingUser) {
      throw new TRPCError({ code: 'CONFLICT', message: 'User with provided email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const { id, firstName, lastName } = await prisma.user.create({ data: { email, hashedPassword, ...rest } });
    return { id, firstName, lastName, email };
  });

const getUser = adminProcedure.input(z.object({ email: z.string() })).query(({ ctx, input }) => {
  console.log(`isAdmin: ${ctx.user.isAdmin.toString()}`);
  return { email: input.email, password: 'password' };
});

const updateUser = adminProcedure.input(z.object({ email: z.string(), password: z.string() })).mutation((req) => {
  return { email: req.input.email, password: req.input.password };
});

export const userRouter = router({
  create: createUser,
  get: getUser,
  update: updateUser
});

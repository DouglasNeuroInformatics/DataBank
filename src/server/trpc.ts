import { TRPCError, initTRPC } from '@trpc/server';

import { type Context } from './context';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const middleware = t.middleware;

export const publicProcedure = t.procedure;

const isAdmin = middleware(async ({ ctx, next }) => {
  if (!ctx.user?.isAdmin) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      user: ctx.user
    }
  });
});

export const adminProcedure = publicProcedure.use(isAdmin);

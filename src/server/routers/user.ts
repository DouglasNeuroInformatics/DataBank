import { z } from 'zod';

import { adminProcedure, router } from '../trpc';

export const userRouter = router({
  get: adminProcedure.input(z.object({ email: z.string() })).query(({ ctx, input }) => {
    console.log(`isAdmin: ${ctx.user.isAdmin.toString()}`);
    return { email: input.email, password: 'password' };
  }),
  update: adminProcedure.input(z.object({ email: z.string(), password: z.string() })).mutation((req) => {
    return { email: req.input.email, password: req.input.password };
  })
});

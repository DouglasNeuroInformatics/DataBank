import { z } from 'zod';

import { procedure, router } from '../trpc';

export const userRouter = router({
  get: procedure.input(z.object({ email: z.string() })).query(({ ctx, input }) => {
    console.log(`isAdmin: ${ctx.isAdmin.toString()}`);
    return { email: input.email, password: 'password' };
  }),
  update: procedure.input(z.object({ email: z.string(), password: z.string() })).mutation((req) => {
    return { email: req.input.email, password: req.input.password };
  })
});

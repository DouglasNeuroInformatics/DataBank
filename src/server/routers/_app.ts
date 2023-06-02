import { z } from 'zod';

import { procedure, router } from '../trpc';

import { userRouter } from './user';

export const appRouter = router({
  sayHello: procedure.query(() => {
    return 'hello from the server';
  }),
  logToServer: procedure.input(z.string()).mutation((req) => {
    console.log(`Client says: ${req.input}`);
  }),
  user: userRouter
});

export type AppRouter = typeof appRouter;

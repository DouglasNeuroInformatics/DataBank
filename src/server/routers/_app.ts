import { z } from 'zod';

import { procedure, router } from '../trpc';

export const appRouter = router({
  sayHello: procedure.query(() => {
    return 'hello from the server';
  }),
  logToServer: procedure.input(z.string()).mutation((req) => {
    console.log(`Client says: ${req.input}`);
  })
});

export type AppRouter = typeof appRouter;

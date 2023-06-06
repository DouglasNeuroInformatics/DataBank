import { router } from '../trpc';

import { authRouter } from './auth';
import { datasetRouter } from './dataset';
import { userRouter } from './user';

export const appRouter = router({
  auth: authRouter,
  dataset: datasetRouter,
  user: userRouter
});

export type AppRouter = typeof appRouter;

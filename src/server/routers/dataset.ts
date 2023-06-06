import { z } from 'zod';

import { publicProcedure, router } from '../trpc';

const createDataset = publicProcedure.input(z.any()).mutation(({ input }) => {
  console.log('Will create dataset', JSON.stringify(input));
});

export const datasetRouter = router({
  create: createDataset
});

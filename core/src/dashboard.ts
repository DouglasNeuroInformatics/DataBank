import { z } from 'zod/v4';

const $Summary = z.object({
  datasetCounts: z.int().min(0),
  projectCounts: z.int().min(0)
});
type $Summary = z.infer<typeof $Summary>;

export { $Summary };

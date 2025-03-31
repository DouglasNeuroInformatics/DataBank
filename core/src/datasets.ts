import { z } from 'zod';

const $DatasetViewPagination = z.object({
  currentPage: z.number(),
  itemsPerPage: z.number()
});

type DatasetViewPagination = z.infer<typeof $DatasetViewPagination>;

export { $DatasetViewPagination };
export type { DatasetViewPagination };

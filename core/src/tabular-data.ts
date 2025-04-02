import { z } from 'zod';

import { $TabularColumn } from './columns';

export const $TabularData = z.object({
  columns: $TabularColumn.array(),
  datasetId: z.string(),
  id: z.string(),
  primaryKeys: z.string().array()
});
export type TabularData = z.infer<typeof $TabularData>;

export const $UpdatePrimaryKeys = z.object({
  primaryKeys: z.string().array()
});

export type UpdatePrimaryKeys = z.infer<typeof $UpdatePrimaryKeys>;

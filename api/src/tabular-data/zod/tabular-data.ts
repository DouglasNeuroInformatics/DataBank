import { z } from 'zod';

import { $TabularColumn } from '@/columns/zod/columns';

const $GetTabularDataViewDto = z.object({
  columnIds: z.string().array(),
  tabularDataId: z.string()
});

export type GetTabularDataViewDto = z.infer<typeof $GetTabularDataViewDto>;

const $TabularData = z.object({
  columns: $TabularColumn.array(),
  datasetId: z.string(),
  id: z.string(),
  primaryKeys: z.string().array()
});
export type TabularData = z.infer<typeof $TabularData>;

const $UpdatePrimaryKeysDto = z.object({
  primaryKeys: z.string().array()
});
export type UpdatePrimaryKeysDto = z.infer<typeof $UpdatePrimaryKeysDto>;

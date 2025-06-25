import { z } from 'zod';

import { $TabularColumn } from './columns';

const $TabularDataDownloadFormat = z.enum(['CSV', 'TSV']);
type TabularDataDownloadFormat = z.infer<typeof $TabularDataDownloadFormat>;

const $TabularData = z.object({
  columns: $TabularColumn.array(),
  datasetId: z.string(),
  id: z.string(),
  primaryKeys: z.string().array()
});
type TabularData = z.infer<typeof $TabularData>;

const $UpdatePrimaryKeys = z.object({
  primaryKeys: z.string().array()
});

type UpdatePrimaryKeys = z.infer<typeof $UpdatePrimaryKeys>;

export { $TabularColumn, $TabularData, $TabularDataDownloadFormat, $UpdatePrimaryKeys };
export type { TabularData, TabularDataDownloadFormat, UpdatePrimaryKeys };

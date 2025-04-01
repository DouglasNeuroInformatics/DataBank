import { z } from 'zod';

const $DatasetViewPagination = z.object({
  currentPage: z.number(),
  itemsPerPage: z.number()
});

type DatasetViewPagination = z.infer<typeof $DatasetViewPagination>;

const $PermissionLevel = z.object({
  permission: z.enum(['PUBLIC', 'LOGIN', 'VERIFIED', 'MANAGER'])
});
type PermissionLevel = z.infer<typeof $PermissionLevel>;

const $CreateDataset = z.object({
  datasetType: z.enum(['BASE', 'TABULAR']),
  description: z.string().optional(),
  isJSON: z.enum(['true', 'false']),
  isReadyToShare: z.enum(['true', 'false']),
  license: z.enum(['PUBLIC', 'OTHER']),
  name: z.string(),
  permission: z.enum(['PUBLIC', 'LOGIN', 'VERIFIED', 'MANAGER']),
  primaryKeys: z.string().optional()
});
type CreateDataset = z.infer<typeof $CreateDataset>;

const $EditDatasetInfo = z.object({
  description: z.string().optional(),
  license: z.enum(['PUBLIC', 'OTHER']).optional(),
  name: z.string().optional(),
  permission: z.enum(['PUBLIC', 'LOGIN', 'VERIFIED', 'MANAGER']).optional()
});
type EditDatasetInfo = z.infer<typeof $EditDatasetInfo>;

const $ColumnDataType = z.object({
  type: z.enum(['BOOLEAN', 'DATETIME', 'ENUM', 'FLOAT', 'INT', 'STRING'])
});
type ColumnDataType = z.infer<typeof $ColumnDataType>;

export { $ColumnDataType, $CreateDataset, $DatasetViewPagination, $EditDatasetInfo, $PermissionLevel };
export type { ColumnDataType, CreateDataset, DatasetViewPagination, EditDatasetInfo, PermissionLevel };

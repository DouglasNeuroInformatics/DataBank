import { DatasetLicense } from '@prisma/client';
import { z } from 'zod';

import { $TabularColumn } from '@/columns/zod/columns';

const $License: Zod.ZodType<DatasetLicense> = z.enum(['PUBLIC', 'OTHER']);

// ------------------ Dataset ----------------------
const $DatasetInfo = z.object({
  createdAt: z.coerce.date(),
  description: z.string().optional(),
  id: z.string(),
  isJSON: z.enum(['true', 'false']),
  isReadyToShare: z.enum(['true', 'false']),
  license: $License,
  managerIds: z.string().array().min(1),
  name: z.string(),
  permission: z.enum(['PUBLIC', 'LOGIN', 'VERIFIED', 'MANAGER']),
  updatedAt: z.coerce.date()
});
// export type DatasetInfo = z.infer<typeof $DatasetInfo>;

const $BaseDatasetModel = $DatasetInfo.extend({
  datasetType: z.literal('BASE')
});
type BaseDatasetModel = z.infer<typeof $BaseDatasetModel>;

const $TabularData = z.object({
  columns: z.array($TabularColumn),
  datasetId: z.string(),
  id: z.string(),
  primaryKeys: z.string()
});

const $TabularDatasetModel = $DatasetInfo.extend({
  datasetType: z.literal('TABULAR'),
  tabularData: $TabularData
});
type TabularDatasetModel = z.infer<typeof $TabularDatasetModel>;

export const $DatasetModel = z.union([$BaseDatasetModel, $TabularDatasetModel]) satisfies z.ZodType<DatasetModel>;
export type DatasetModel = BaseDatasetModel | TabularDatasetModel;

// --------------- DTO --------------------------
export const $CreateTabularDatasetDto = $DatasetInfo
  .omit({
    createdAt: true,
    id: true,
    updatedAt: true
  })
  .extend({
    datasetType: z.literal('TABULAR'),
    primaryKeys: z.string()
  });

export type CreateTabularDatasetDto = z.infer<typeof $CreateTabularDatasetDto>;

export const $GetDataViewDto = z.object({
  datasetId: z.string()
});
export type GetDataViewDto = z.infer<typeof $GetDataViewDto>;

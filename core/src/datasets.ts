import { z } from 'zod';

import { $PermissionLevel, $TabularColumnSummary } from './columns';
import { $DatasetLicenses } from './licenses';

import type { PermissionLevel } from './columns';

const $DatasetViewPagination = z.object({
  currentPage: z.number(),
  itemsPerPage: z.number()
});
type DatasetViewPagination = z.infer<typeof $DatasetViewPagination>;

const $DatasetType = z.enum(['BASE', 'BINARY', 'TABULAR']);
type DatasetType = z.infer<typeof $DatasetType>;

const $DatasetStatus = z.enum(['Fail', 'Processing', 'Success']);
type DatasetStatus = z.infer<typeof $DatasetStatus>;

const $CreateDataset = z.object({
  datasetType: $DatasetType,
  description: z.string().optional(),
  isJSON: z.enum(['true', 'false']),
  isReadyToShare: z.enum(['true', 'false']),
  license: $DatasetLicenses,
  name: z.string(),
  permission: $PermissionLevel,
  primaryKeys: z.string().optional()
});
type CreateDataset = z.infer<typeof $CreateDataset>;

const $EditDatasetInfo = z.object({
  description: z.string().optional(),
  license: $DatasetLicenses.optional(),
  name: z.string().optional(),
  permission: $PermissionLevel.optional()
});
type EditDatasetInfo = z.infer<typeof $EditDatasetInfo>;

const $DatasetInfo = z.object({
  createdAt: z.date(),
  datasetType: $DatasetType,
  description: z.string().nullable(),
  id: z.string(),
  isReadyToShare: z.boolean(),
  license: z.string(),
  managerIds: z.string().array(),
  name: z.string(),
  permission: $PermissionLevel,
  status: $DatasetStatus,
  updatedAt: z.date()
});
type DatasetInfo = z.infer<typeof $DatasetInfo>;

type DatasetCardProps = DatasetInfo & { isManager: boolean; isPublic: boolean };

const $TabularDataRow = z.record(z.union([z.string(), z.number(), z.boolean(), z.null()]));
type TabularDataRow = z.infer<typeof $TabularDataRow>;

const $TabularDatasetView = z.object({
  columnIds: z.record(z.string()),
  columns: z.string().array(),
  metadata: z.record($TabularColumnSummary),
  primaryKeys: z.string().array(),
  rows: $TabularDataRow.array(),
  totalNumberOfColumns: z.number().min(0),
  totalNumberOfRows: z.number().min(0)
});
type TabularDatasetView = z.infer<typeof $TabularDatasetView>;

const $ProjectTabularDatasetView = $TabularDatasetView.omit({
  primaryKeys: true
});
type ProjectTabularDatasetView = z.infer<typeof $ProjectTabularDatasetView>;

type TabularDataset = DatasetInfo & TabularDatasetView;

export {
  $CreateDataset,
  $DatasetInfo,
  $DatasetLicenses,
  $DatasetStatus,
  $DatasetViewPagination,
  $EditDatasetInfo,
  $PermissionLevel,
  $ProjectTabularDatasetView
};

export type {
  CreateDataset,
  DatasetCardProps,
  DatasetInfo,
  DatasetStatus,
  DatasetType,
  DatasetViewPagination,
  EditDatasetInfo,
  PermissionLevel,
  ProjectTabularDatasetView,
  TabularDataRow,
  TabularDataset,
  TabularDatasetView
};

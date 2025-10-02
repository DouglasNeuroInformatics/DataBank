import { z } from 'zod/v4';

import { $PermissionLevel, $TabularColumnSummary } from './columns';
import { $DatasetLicenses } from './licenses';

const $DatasetViewPagination = z.object({
  currentPage: z.int().gte(1),
  itemsPerPage: z.int().gte(1)
});
type $DatasetViewPagination = z.infer<typeof $DatasetViewPagination>;

const $DatasetType = z.enum(['BASE', 'BINARY', 'TABULAR']);
type $DatasetType = z.infer<typeof $DatasetType>;

const $DatasetStatus = z.enum(['Fail', 'Processing', 'Success']);
type $DatasetStatus = z.infer<typeof $DatasetStatus>;

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
type $CreateDataset = z.infer<typeof $CreateDataset>;

const $EditDatasetInfo = z.object({
  description: z.string().optional(),
  license: $DatasetLicenses.optional(),
  name: z.string().optional(),
  permission: $PermissionLevel.optional()
});
type $EditDatasetInfo = z.infer<typeof $EditDatasetInfo>;

const $DatasetInfo = z.object({
  createdAt: z.union([z.iso.datetime().transform((dateStr) => new Date(dateStr)), z.date()]),
  datasetType: $DatasetType,
  description: z.string().nullable(),
  id: z.string(),
  isReadyToShare: z.boolean(),
  license: $DatasetLicenses,
  managerIds: z.string().array(),
  name: z.string(),
  permission: $PermissionLevel,
  status: $DatasetStatus,
  updatedAt: z.union([z.iso.datetime().transform((dateStr) => new Date(dateStr)), z.date()])
});
type $DatasetInfo = z.infer<typeof $DatasetInfo>;

const $DatasetCardProps = $DatasetInfo.and(z.object({ isManager: z.boolean(), isPublic: z.boolean() }));
type $DatasetCardProps = z.infer<typeof $DatasetCardProps>;

const $TabularDataRow = z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]));
type $TabularDataRow = z.infer<typeof $TabularDataRow>;

const $TabularDatasetView = z.object({
  columnIds: z.record(z.string(), z.string()),
  columns: z.string().array(),
  metadata: z.record(z.string(), $TabularColumnSummary),
  primaryKeys: z.string().array(),
  rows: $TabularDataRow.array(),
  totalNumberOfColumns: z.number().min(0),
  totalNumberOfRows: z.number().min(0)
});
type $TabularDatasetView = z.infer<typeof $TabularDatasetView>;

const $ProjectTabularDatasetView = $TabularDatasetView.omit({
  primaryKeys: true
});
type $ProjectTabularDatasetView = z.infer<typeof $ProjectTabularDatasetView>;

const $TabularDataset = $DatasetInfo.and($TabularDatasetView);
type $TabularDataset = z.infer<typeof $TabularDataset>;

export {
  $CreateDataset,
  $DatasetCardProps,
  $DatasetInfo,
  $DatasetLicenses,
  $DatasetStatus,
  $DatasetViewPagination,
  $EditDatasetInfo,
  $PermissionLevel,
  $ProjectTabularDatasetView,
  $TabularDataset,
  $TabularDatasetView
};

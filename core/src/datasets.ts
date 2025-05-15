import { z } from 'zod';

import type { ColumnSummary } from './columns';

type AddProjectDatasetColumns = {
  [key: string]: string;
};

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

type DatasetType = 'BASE' | 'BINARY' | 'TABULAR';

type DatasetStatus = 'Fail' | 'Processing' | 'Success';

type DatasetInfo = {
  createdAt: Date;
  datasetType: DatasetType;
  description: null | string;
  id: string;
  isReadyToShare: boolean;
  license: string;
  managerIds: string[];
  name: string;
  permission: PermissionLevel;
  status: DatasetStatus;
  updatedAt: Date;
};

type DatasetCardProps = DatasetInfo & { isManager: boolean; isPublic: boolean };

type TabularDataRow = {
  [key: string]: boolean | Date | number | string;
};

type TabularDatasetView = {
  columnIds: { [key: string]: string };
  columns: string[];
  metadata: { [key: string]: ColumnSummary };
  primaryKeys: string[];
  rows: { [key: string]: boolean | null | number | string }[];
  totalNumberOfColumns: number;
  totalNumberOfRows: number;
};

type ProjectTabularDatasetView = {
  columnIds: { [key: string]: string };
  columns: string[];
  metadata: { [key: string]: ColumnSummary };
  rows: { [key: string]: boolean | null | number | string }[];
  totalNumberOfColumns: number;
  totalNumberOfRows: number;
};

type TabularDataset = DatasetInfo & {
  columnIds: { [key: string]: string };
  columns: string[];
  metadata: {
    [key: string]: {
      count: number;
      distribution?: { [key: string]: number };
      kind: ColumnDataType;
      max?: number;
      mean?: number;
      median?: number;
      min?: number;
      mode?: number;
      nullable: boolean;
      nullCount: number;
      std?: number;
    };
  };
  primaryKeys: string[];
  rows: { [key: string]: string }[];
  totalNumberOfColumns: number;
  totalNumberOfRows: number;
};

export { $ColumnDataType, $CreateDataset, $DatasetViewPagination, $EditDatasetInfo, $PermissionLevel };
export type {
  AddProjectDatasetColumns,
  ColumnDataType,
  CreateDataset,
  DatasetCardProps,
  DatasetInfo,
  DatasetViewPagination,
  EditDatasetInfo,
  PermissionLevel,
  ProjectTabularDatasetView,
  TabularDataRow,
  TabularDataset,
  TabularDatasetView
};

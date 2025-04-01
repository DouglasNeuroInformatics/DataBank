/* eslint-disable import/exports-last */

export * from './columns';
export * from './datasets';
export * from './setup';
export * from './tabular-data';
export * from './users';

import type { ColumnSummary } from './columns';
///// LEGACY
/** CORE */
import type { ColumnDataType, PermissionLevel } from './datasets';

export type Locale = 'en' | 'fr';

export type ExceptionResponse = {
  message: string;
};

/** AUTH */

export type AuthPayload = {
  accessToken: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type EmailConfirmationProcedureInfo = {
  /** The number of previous attempts to verify this code */
  attemptsMade: number;

  /** The unix timestamp after which the code will be invalidated */
  expiry: Date;
};

/** Activity */

export type CreateDatasetActivity = {
  datasetName: string;
  kind: 'CREATED_DATASET';
};

export type UpdateDatasetActivity = {
  datasetName: string;
  kind: 'UPDATED_DATASET';
};

export type Activity = CreateDatasetActivity | UpdateDatasetActivity;

// Datasets
export type PermissionLevel = 'LOGIN' | 'MANAGER' | 'PUBLIC' | 'VERIFIED';

export type DatasetType = 'BASE' | 'BINARY' | 'TABULAR';

export type DatasetInfo = {
  createdAt: Date;
  datasetType: DatasetType;
  description: null | string;
  id: string;
  isReadyToShare: boolean;
  license: string;
  managerIds: string[];
  name: string;
  permission: PermissionLevel;
  updatedAt: Date;
};

export type DatasetCardProps = DatasetInfo & { isManager: boolean };

export type TabularDataRow = {
  [key: string]: boolean | Date | number | string;
};

export type TabularDatasetView = {
  columnIds: { [key: string]: string };
  columns: string[];
  metadata: { [key: string]: ColumnSummary };
  primaryKeys: string[];
  rows: { [key: string]: boolean | null | number | string }[];
  totalNumberOfColumns: number;
  totalNumberOfRows: number;
};

export type ProjectTabularDatasetView = {
  columnIds: { [key: string]: string };
  columns: string[];
  metadata: { [key: string]: ColumnSummary };
  rows: { [key: string]: boolean | null | number | string }[];
  totalNumberOfColumns: number;
  totalNumberOfRows: number;
};

export type TabularDataset = DatasetInfo & {
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

// Projects
export type ProjectColumnHash = {
  length: null | number;
  salt: string;
};

export type ProjectColumnTrim = {
  end: null | number;
  start: null | number;
};

export type ProjectColumn = {
  columnId: string;
  hash: null | ProjectColumnHash;
  trim: null | ProjectColumnTrim;
};

export type ProjectRowFilter = {
  rowMax: null | number;
  rowMin: null | number;
};

export type ProjectDatasetDto = {
  columns: ProjectColumn[];
  datasetId: string;
  dataTypeFilters: ColumnDataType[];
  rowFilter: null | ProjectRowFilter;
  useDataTypeFilter: boolean;
  useRowFilter: boolean;
};

export type EditProjectInfoDto = {
  description?: string | undefined;
  expiry?: Date | undefined;
  externalId?: string | undefined;
  name?: string | undefined;
};

export type AddProjectDatasetColumns = {
  [key: string]: string;
};

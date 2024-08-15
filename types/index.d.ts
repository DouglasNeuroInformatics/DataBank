/** CORE */

import type { JsonValue } from 'type-fest';

export type Locale = 'en' | 'fr';

export type ExceptionResponse = {
  message: string;
};

/** AUTH */

export type AuthPayload = {
  accessToken: string;
};

export type UserRole = 'ADMIN' | 'STANDARD';

export type CurrentUser = {
  confirmedAt: Date | null | undefined;
  datasetId: string[];
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  role: UserRole;
  verifiedAt: Date | null | undefined;
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

/** USER */

export type TUser = {
  confirmedAt: null | number | undefined;
  creationTime?: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  verifiedAt: null | number | undefined;
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

/** Setup */

export type SetupState = {
  isSetup: boolean | null;
};

export type SetupDto = {
  admin: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  };

  setupConfig: TSetupConfig;
};

export type TSetupConfig = {
  userVerification: TVerificationInfo;
};

/** Verification */

export type TVerificationWithRegex = {
  kind: 'REGEX_EMAIL';
  regex: string;
};

export type TVerificationUponConfirmEmail = {
  kind: 'CONFIRM_EMAIL';
};

export type TManualVerification = {
  kind: 'MANUAL';
};

export type TVerificationInfo = TManualVerification | TVerificationUponConfirmEmail | TVerificationWithRegex;

// Datasets
type PermissionLevel = 'LOGIN' | 'MANAGER' | 'PUBLIC' | 'VERIFIED';

type DatasetType = 'BASE' | 'BINARY' | 'TABULAR';

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

export type DatasetCardProps = { isManager: boolean } & DatasetInfo;

export type TabularDataRow = {
  [key: string]: Date | boolean | number | string;
};

export type TabularDatasetView = {
  columnIds: string[];
  columns: string[];
  metadata: { [key: string]: ColumnSummary };
  primaryKeys: string[];
  rows: { [key: string]: boolean | null | number | string }[];
  totalNumberOfColumns: number;
  totalNumberOfRows: number;
};

export type ColumnDataType = 'BOOLEAN' | 'DATETIME' | 'ENUM' | 'FLOAT' | 'INT' | 'STRING';

export type TabularDataset = {
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
      nullCount: number;
      nullable: boolean;
      std?: number;
    };
  };
  primaryKeys: string[];
  rows: { [key: string]: string }[];
  totalNumberOfColumns: number;
  totalNumberOfRows: number;
} & DatasetInfo;

export type BaseColumnSummary = {
  count: number;
  nullCount: number;
};

export type StringColumnSummary = {
  kind: 'STRING';
};

export type IntColumnSummary = {
  kind: 'INT';
  max?: number;
  mean?: number;
  median?: number;
  min?: number;
  mode?: number;
  std?: number;
};

export type FloatColumnSummary = {
  kind: 'FLOAT';
  max?: number;
  mean?: number;
  median?: number;
  min?: number;
  std?: number;
};

export type BooleanColumnSummary = {
  kind: 'BOOLEAN';
  trueCount: number;
};

export type EnumColumnSummary = {
  distribution?: JsonValue;
  kind: 'ENUM';
};

export type DatetimeColumnSummary = {
  kind: 'DATETIME';
  max: Date;
  min: Date;
};

export type ColumnSummary = (
  | BooleanColumnSummary
  | DatetimeColumnSummary
  | EnumColumnSummary
  | FloatColumnSummary
  | IntColumnSummary
  | StringColumnSummary
) &
  BaseColumnSummary;

export type DatasetViewPaginationDto = {
  currentPage: number;
  itemsPerPage: number;
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
  hash: ProjectColumnHash | null;
  kind: ColumnDataType;
  trim: ProjectColumnTrim | null;
};

export type ProjectRowFilter = {
  rowMax: null | number;
  rowMin: null | number;
};

export type ProjectDatasetDto = {
  columns: ProjectColumn[];
  dataTypeFilters: ColumnDataType[];
  datasetId: string;
  rowFilter: ProjectRowFilter | null;
  useColumnFilter: boolean;
  useDataTypeFilter: boolean;
  useRowFilter: boolean;
};

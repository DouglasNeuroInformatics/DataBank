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
  emailRegex: string;
  kind: 'REGEX_EMAIL';
};

export type TVerificationUponConfirmEmail = {
  kind: 'CONFIRM_EMAIL';
};

export type TManualVerification = {
  kind: 'MANUAL';
};

export type TVerificationInfo = TManualVerification | TVerificationUponConfirmEmail | TVerificationWithRegex;

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

export type ColumnDataType = 'BOOLEAN' | 'DATETIME' | 'ENUM' | 'FLOAT' | 'INT' | 'STRING';

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

export type ColumnSummary = BaseColumnSummary &
  (
    | BooleanColumnSummary
    | DatetimeColumnSummary
    | EnumColumnSummary
    | FloatColumnSummary
    | IntColumnSummary
    | StringColumnSummary
  );

export type DatasetViewPaginationDto = {
  currentPage: number;
  itemsPerPage: number;
};

export type EditDatasetInfoDto = {
  description?: string | undefined;
  license?: 'OTHER' | 'PUBLIC' | undefined;
  name?: string | undefined;
  permission?: 'LOGIN' | 'MANAGER' | 'PUBLIC' | 'VERIFIED' | undefined;
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

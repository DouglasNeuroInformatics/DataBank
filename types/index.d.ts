/** CORE */

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
type PermissionLevel = 'LOGIN' | 'MANAGER' | 'PUBLIC' | 'VERIFY';

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

export type TabularDataset<T extends TabularDataRow> = {
  columnIds: [string];
  columns: [keyof T];
  metadata: { [k in keyof T]: ColumnSummary };
  primaryKeys: [Partial<keyof T>];
  rows: T[];
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
  max: number;
  mean: number;
  median: number;
  min: number;
  mode: number;
  std: number;
};

export type FloatColumnSummary = {
  kind: 'FLOAT';
  max: number;
  mean: number;
  median: number;
  min: number;
  std: number;
};

export type BooleanColumnSummary = {
  kind: 'BOOLEAN';
  trueCount: number;
};

export type EnumColumnSummary = {
  distribution: { [key: string]: number };
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

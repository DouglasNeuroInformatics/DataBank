/** CORE */

import { Simplify } from 'type-fest';

export type Locale = 'en' | 'fr';

export type ExceptionResponse = {
  message: string;
};

/** AUTH */

export type AuthPayload = {
  accessToken: string;
};

export type UserRole = 'admin' | 'standard';

export type CurrentUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  verifiedAt: number | null | undefined;
  confirmedAt: number | null | undefined;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type EmailConfirmationProcedureInfo = {
  /** The number of previous attempts to verify this code */
  attemptsMade: number;

  /** The unix timestamp after which the code will be invalidated */
  expiry: number;
};

/** USER */

export type TUser = {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  verifiedAt: number | null | undefined;
  confirmedAt: number | null | undefined;
  creationTime?: number;
};

/** DATASETS */

export type DatasetLicense = 'PUBLIC_DOMAIN' | 'OTHER';

export type DatasetColumnType = 'STRING' | 'FLOAT' | 'INTEGER';

export type DatasetInfo = {
  _id: string;
  createdAt: number;
  updatedAt: number;
  owner: TUser;
  name: string;
  description: string;
  license: DatasetLicense;
};

/** Corresponds to a row in the dataset */
export type DatasetEntry = {
  [key: string]: string | number;
};

/** Metadata for a column in the dataset */
export type TDatasetColumn<T extends DatasetEntry = DatasetEntry> = {
  name: Extract<keyof T, string>;
  description: string;
  nullable: boolean;
  type: DatasetColumnType;
};

export type TDataset<T extends DatasetEntry = DatasetEntry> = Simplify<
  DatasetInfo & {
    columns: TDatasetColumn<T>[];
    data: T[];
  }
>;

/** Activity */

export type CreateDatasetActivity = {
  kind: 'CREATED_DATASET';
  datasetName: string;
};

export type UpdateDatasetActivity = {
  kind: 'UPDATED_DATASET';
  datasetName: string;
};

export type Activity = CreateDatasetActivity | UpdateDatasetActivity;

/** Setup */

export type SetupState = {
  isSetup: boolean | null;
};

export type SetupOptions = {
  admin: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };

  setupConfig: TSetupConfig;
};

export type TSetupConfig = {
  verificationInfo: TVerificationInfo;
};

/** Verification */

export type TVerificationWithRegex = {
  kind: 'VERIFICATION_WITH_REGEX';
  regex: string;
};

export type TVerificationUponConfirmEmail = {
  kind: 'VERIFICATION_UPON_CONFIRM_EMAIL';
};

export type TManualVerification = {
  kind: 'MANUAL_VERIFICATION';
};

export type TVerificationInfo = TVerificationWithRegex | TVerificationUponConfirmEmail | TManualVerification;

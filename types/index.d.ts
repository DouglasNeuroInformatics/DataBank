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
export type DatasetInfo = {
  createdAt: Date;
  datasetType: 'BASE' | 'BINARY' | 'TABULAR';
  description: null | string;
  id: string;
  license: string;
  managerIds: string[];
  name: string;
  updatedAt: Date;
};

export type DatasetCardProps = { isManager: boolean } & DatasetInfo;

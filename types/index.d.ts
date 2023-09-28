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
  isVerified: boolean;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type VerificationProcedureInfo = {
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
  isVerified: boolean;
  verifiedAt?: number;
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
};

/** PROJECTS */

export type ProjectColumnType = 'STRING' | 'FLOAT' | 'INTEGER';

export type ProjectInfo = {
  _id: string;
  createdAt: number;
  updatedAt: number;
  name: string;
  description: string;
  externalId?: string;
  expiry: number;
  users: TUser[];
};

export type ProjectEntry = {
  [key: string]: string | number;
};

export type TProjectColumn<T extends ProjectEntry = ProjectEntry> = {
  name: Extract<keyof T, string>;
  description: string;
  nullable: boolean;
  type: ProjectColumnType;
};

export type TProject<T extends ProjectEntry = ProjectEntry> = Simplify<
  ProjectInfo & {
    columns: TProjectColumn<T>[];
    data: T[];
  }
>;

/** CORE */

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

/** CORE */

export type Locale = 'en' | 'fr';

export type ExceptionResponse = {
  message: string;
};

/** AUTH */

export type UserRole = 'admin' | 'standard';

export type CurrentUser = {
  email: string;
  role: UserRole;
  isVerified: boolean;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type VerificationProcedureInfo = {
  /** The unix timestamp after which the code will be invalidated */
  expiry: number;
};

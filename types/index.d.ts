export interface Greeting {
  message: string;
}

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

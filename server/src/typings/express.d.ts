import type { CurrentUser, Locale } from '@databank/types';

declare global {
  namespace Express {
    interface Request {
      locale?: Locale;
      user?: Partial<CurrentUser>;
    }
  }
}

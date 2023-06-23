import type { CurrentUser, Locale } from '@databank/types';
import { Simplify } from 'type-fest';

declare global {
  namespace Express {
    interface Request {
      user: Simplify<
        CurrentUser & {
          locale: Locale;
        }
      >;
    }
  }
}

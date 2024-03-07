/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { CurrentUser, Locale } from '@databank/types';
import 'multer';
import { Simplify } from 'type-fest';

declare global {
  namespace Express {
    interface Request {
      user?: Simplify<
        CurrentUser & {
          locale?: Locale;
        }
      >;
    }
  }
}

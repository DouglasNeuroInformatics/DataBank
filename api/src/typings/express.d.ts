/* eslint-disable @typescript-eslint/consistent-type-definitions */

import type { CurrentUser, Locale } from '@databank/core';
import { Simplify } from 'type-fest';

import 'multer';

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

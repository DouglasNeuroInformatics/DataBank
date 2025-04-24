/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/consistent-type-definitions */

import type { CurrentUser } from '@databank/core';

import 'multer';

declare global {
  namespace Express {
    interface User extends CurrentUser {}
  }
}

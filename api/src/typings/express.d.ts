import type { CurrentUser } from '@databank/core';

import 'multer';

declare global {
  namespace Express {
    interface User extends CurrentUser {}
  }
}

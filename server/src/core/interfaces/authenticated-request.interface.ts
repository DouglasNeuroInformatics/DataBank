import { CurrentUser } from '@databank/types';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: CurrentUser;
}

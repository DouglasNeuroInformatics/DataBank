import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { CurrentUser } from '@databank/types';
import { type Request } from 'express';

export const RequestUser = createParamDecorator((key: keyof CurrentUser, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<Request>();
  if (key) {
    return request.user?.[key];
  }
  return request.user;
});

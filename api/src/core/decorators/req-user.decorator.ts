import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { Request } from 'express';

export const RequestUser = createParamDecorator(
  (key: keyof NonNullable<Request['user']> | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    if (key) {
      return request.user![key];
    }
    return request.user!;
  }
);

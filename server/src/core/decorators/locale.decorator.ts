import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { type Request } from 'express';

export const Locale = createParamDecorator((_, context: ExecutionContext) => {
  return context.switchToHttp().getRequest<Request>().locale;
});

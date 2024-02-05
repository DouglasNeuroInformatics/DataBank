import { type ExecutionContext, InternalServerErrorException, createParamDecorator } from '@nestjs/common';
import { type Request } from 'express';

export const UserId = createParamDecorator((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<Request>();
  if (!request.user?.id) {
    throw new InternalServerErrorException(`Value cannot be coerced to object ID: ${request.user?.id}`);
  }
  return request.user.id;
});

import { SetMetadata } from '@nestjs/common';

import { UserRole } from '@app/types';

type PublicRouteAccess = 'public';

export type ProtectedRouteAccess = {
  role: UserRole;
};

export type RouteAccessType = PublicRouteAccess | ProtectedRouteAccess;

export function RouteAccess(value: RouteAccessType): MethodDecorator {
  return SetMetadata('RouteAccess', value);
}

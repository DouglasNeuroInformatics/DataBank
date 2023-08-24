import { SetMetadata } from '@nestjs/common';

import { UserRole } from '@databank/types';

type PublicRouteAccess = 'public';

export type ProtectedRouteAccess = {
  role: UserRole;
  allowUnverified?: boolean;
};

export type RouteAccessType = PublicRouteAccess | ProtectedRouteAccess;

export function RouteAccess(value: RouteAccessType): MethodDecorator {
  return SetMetadata('RouteAccess', value);
}

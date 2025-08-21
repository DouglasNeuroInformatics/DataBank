import { $UserRole } from '@databank/core';
import { SetMetadata } from '@nestjs/common';

type PublicRouteAccess = 'public';

export type ProtectedRouteAccess = {
  allowUnverified?: boolean;
  role: $UserRole;
};

export type RouteAccessType = ProtectedRouteAccess | PublicRouteAccess;

export function RouteAccess(value: RouteAccessType): MethodDecorator {
  return SetMetadata('RouteAccess', value);
}

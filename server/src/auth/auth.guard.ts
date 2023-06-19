import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { CurrentUser, UserRole } from '@databank/types';
import { Request } from 'express';

import { ProtectedRouteAccess, RouteAccessType } from '../core/decorators/route-access.decorator.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const routeAccess = this.getRouteAccess(context);

    // If public route, then no need to verify integrity of token
    if (routeAccess === 'public') {
      return true;
    }

    // Check if token exists
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    // Validate token and extract payload
    let payload: CurrentUser;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow('SECRET_KEY')
      });
    } catch (error) {
      throw new UnauthorizedException();
    }

    // Attach user to request for route handlers
    request.user = payload;

    // Access user permissions

    return this.isAuthorized(request.user?.role, routeAccess);
  }

  /** Return the permissions required to access the current route */
  private getRouteAccess(context: ExecutionContext): RouteAccessType {
    return (
      this.reflector.getAllAndOverride('RouteAccess', [context.getHandler(), context.getClass()]) ?? { role: 'admin' }
    );
  }

  /** Return the access token from the request header, or null if non-existant or malformed */
  private extractTokenFromHeader(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }

  private isAuthorized(role?: UserRole, routeAccess?: ProtectedRouteAccess) {
    switch (role) {
      case 'admin':
        return true;
      case 'standard':
        return routeAccess?.role === 'standard';
      default:
        return false;
    }
  }
}

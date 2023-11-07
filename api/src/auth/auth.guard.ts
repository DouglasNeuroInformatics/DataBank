import type { CurrentUser, UserRole } from '@databank/types';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { type Request } from 'express';

import { type ProtectedRouteAccess, type RouteAccessType } from '../core/decorators/route-access.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

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
      this.logger.verbose('Request header does not include auth token');
      throw new UnauthorizedException('Invalid Credentials');
    }

    // Validate token and extract payload
    let payload: CurrentUser;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow('SECRET_KEY')
      });
    } catch (error) {
      this.logger.warn('Failed to parse JWT. Potential attacker.');
      throw new UnauthorizedException('Invalid Credentials');
    }

    if (!routeAccess.allowUnverified && !payload.verifiedAt) {
      throw new UnauthorizedException('Email confirmation required');
    }

    // Attach user to request for route handlers
    request.user = Object.assign(request.user ?? {}, payload);

    // Access user permissions
    return this.isAuthorized(request.user.role, routeAccess);
  }

  /** Return the access token from the request header, or null if non-existant or malformed */
  private extractTokenFromHeader(request: Request): null | string {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type === 'Bearer' && typeof token === 'string') {
      return token;
    }
    return null;
  }

  /** Return the permissions required to access the current route */
  private getRouteAccess(context: ExecutionContext): RouteAccessType {
    const routeAccess = this.reflector.getAllAndOverride<RouteAccessType | undefined>('RouteAccess', [
      context.getHandler(),
      context.getClass()
    ]);
    return routeAccess ?? { role: 'admin' };
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

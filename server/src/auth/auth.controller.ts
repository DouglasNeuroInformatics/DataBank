import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { type CurrentUser } from '@databank/types';

import { RouteAccess } from '../core/decorators/route-access.decorator.js';

import { AuthService } from './auth.service.js';
import { CreateAccountDto } from './dto/create-account.dto.js';
import { LoginRequestDto } from './dto/login-request.dto.js';

import { RequestUser } from '@/core/decorators/request-user.decorator.js';

@Controller({ path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @RouteAccess('public')
  login(@Body() { email, password }: LoginRequestDto) {
    return this.authService.login(email, password);
  }

  @Post('account')
  @RouteAccess('public')
  createAccount(@Body() createAccountDto: CreateAccountDto) {
    return this.authService.createAccount(createAccountDto);
  }

  @Post('verification-code')
  @RouteAccess({ allowUnverified: true, role: 'standard' })
  sendVerificationCode(@RequestUser() user: CurrentUser) {
    return this.authService.sendVerificationCode(user);
  }
}

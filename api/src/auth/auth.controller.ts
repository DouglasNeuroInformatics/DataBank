import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { type Request } from 'express';

import { RouteAccess } from '../core/decorators/route-access.decorator.js';
import { AuthService } from './auth.service.js';
import { CreateAccountDto } from './dto/create-account.dto.js';
import { LoginRequestDto } from './dto/login-request.dto.js';
import { VerifyAccountDto } from './dto/verify-account.dto.js';

@ApiTags('Auth')
@Controller({ path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ description: 'Create a new account as a standard user', summary: 'Create Account' })
  @Post('account')
  @RouteAccess('public')
  createAccount(@Body() createAccountDto: CreateAccountDto) {
    return this.authService.createAccount(createAccountDto);
  }

  @ApiOperation({ description: 'Request an access token from the server', summary: 'Login' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @RouteAccess('public')
  login(@Body() { email, password }: LoginRequestDto) {
    return this.authService.login(email, password);
  }

  @ApiOperation({ description: 'Request a confirm email code', summary: 'Request Confirm Email Code' })
  @Post('confirm-email-code')
  @RouteAccess({ allowUnverified: true, role: 'STANDARD' })
  sendConfirmEmailCode(@Req() request: Request) {
    return this.authService.sendConfirmEmailCode(request.user!, request.user!.locale);
  }

  @ApiOperation({ description: 'Verify an account using a verification code', summary: 'Verify Account' })
  @Post('verify-account')
  @RouteAccess({ allowUnverified: true, role: 'STANDARD' })
  verifyAccount(@Req() request: Request, @Body() verifyAccountDto: VerifyAccountDto) {
    return this.authService.verifyAccount(verifyAccountDto, request.user!);
  }
}

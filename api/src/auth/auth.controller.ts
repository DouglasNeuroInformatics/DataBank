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

  @ApiOperation({ summary: 'Login', description: 'Request an access token from the server' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @RouteAccess('public')
  login(@Body() { email, password }: LoginRequestDto) {
    return this.authService.login(email, password);
  }

  @ApiOperation({ summary: 'Create Account', description: 'Create a new account as a standard user' })
  @Post('account')
  @RouteAccess('public')
  createAccount(@Body() createAccountDto: CreateAccountDto) {
    return this.authService.createAccount(createAccountDto);
  }

  @ApiOperation({ summary: 'Request Verification Code', description: 'Request a verification code' })
  @Post('verification-code')
  @RouteAccess({ allowUnverified: true, role: 'standard' })
  sendVerificationCode(@Req() request: Request) {
    return this.authService.sendVerificationCode(request.user!, request.user!.locale);
  }

  @ApiOperation({ summary: 'Verify Account', description: 'Verify an account using a verification code' })
  @Post('verify')
  @RouteAccess({ allowUnverified: true, role: 'standard' })
  verifyAccount(@Req() request: Request, @Body() verifyAccountDto: VerifyAccountDto) {
    return this.authService.verifyAccount(verifyAccountDto, request.user!);
  }
}

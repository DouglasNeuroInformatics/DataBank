import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { type Request } from 'express';

import { RouteAccess } from '../core/decorators/route-access.decorator';
import { AuthService } from './auth.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { VerifyAccountDto } from './dto/verify-account.dto';

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
  @RouteAccess({ allowUnverified: true, role: 'standard' })
  sendConfirmEmailCode(@Req() request: Request) {
    return this.authService.sendConfirmEmailCode(request.user!, request.user!.locale);
  }

  @ApiOperation({ description: 'Verify an account using a verification code', summary: 'Verify Account' })
  @Post('verify-account')
  @RouteAccess({ allowUnverified: true, role: 'standard' })
  verifyAccount(@Req() request: Request, @Body() verifyAccountDto: VerifyAccountDto) {
    return this.authService.verifyAccount(verifyAccountDto, request.user!);
  }
}

import { randomInt } from 'crypto';

import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CurrentUser, VerificationProcedureInfo } from '@databank/types';
import bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service.js';

import { CreateAccountDto } from './dto/create-account.dto.js';
import { VerifyAccountDto } from './dto/verify-account.dto.js';
import { VerificationCode } from './schemas/verification-code.schema.js';

import { I18nService } from '@/i18n/i18n.service.js';
import { MailService } from '@/mail/mail.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly i18n: I18nService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly usersService: UsersService
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException(this.i18n.translate('en', 'errors.unauthorized.invalidCredentials'));
    }

    const isCorrectPassword = await bcrypt.compare(password, user.hashedPassword);
    if (!isCorrectPassword) {
      throw new UnauthorizedException('Incorrect password');
    }

    const payload: CurrentUser = {
      email,
      role: user.role,
      isVerified: user.isVerified
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  /** Create a new standard account with verification required */
  async createAccount(createAccountDto: CreateAccountDto): Promise<CurrentUser> {
    return this.usersService.createUser({ ...createAccountDto, role: 'standard', isVerified: false });
  }

  async sendVerificationCode(user: CurrentUser): Promise<VerificationProcedureInfo> {
    const verificationCode: VerificationCode = {
      expiry: Date.now() + 360000, // 6 min from now - 5 is shown to user + 1 for network latency
      value: randomInt(100000, 1000000)
    };
    await this.usersService.setVerificationCode(user.email, verificationCode);
    await this.mailService.sendMail({
      to: user.email,
      subject: 'Douglas Data Bank: Verification Code',
      text: 'Your verification code is ' + verificationCode.value
    });
    return { expiry: verificationCode.expiry };
  }

  async verifyAccount({ email }: CurrentUser, { code }: VerifyAccountDto) {
    const user = await this.usersService.findByEmail(email);
    if (user?.verificationCode.value === code && user.verificationCode.expiry > Date.now()) {
      await user.updateOne({ verificationCode: undefined, verifiedAt: Date.now(), isVerified: true });
      return;
    }
    throw new ForbiddenException();
  }
}

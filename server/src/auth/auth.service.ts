import { randomInt } from 'crypto';

import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { CurrentUser, Locale, VerificationProcedureInfo } from '@databank/types';
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
    private readonly config: ConfigService,
    private readonly i18n: I18nService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly usersService: UsersService
  ) {}

  async login(email: string, password: string, locale?: Locale) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException(this.i18n.translate(locale, 'errors.unauthorized.invalidCredentials'));
    }

    const isCorrectPassword = await bcrypt.compare(password, user.hashedPassword);
    if (!isCorrectPassword) {
      throw new UnauthorizedException(this.i18n.translate(locale, 'errors.unauthorized.invalidCredentials'));
    }

    const { firstName, lastName, role, isVerified } = user;

    const payload: CurrentUser = { firstName, lastName, email, role, isVerified };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  /** Create a new standard account with verification required */
  async createAccount(createAccountDto: CreateAccountDto): Promise<CurrentUser> {
    return this.usersService.createUser({ ...createAccountDto, role: 'standard', isVerified: false });
  }

  async sendVerificationCode({ email }: CurrentUser, locale?: Locale): Promise<VerificationProcedureInfo> {
    // This should never happen when called from controller, but in case it is ever called elsewhere
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(this.i18n.translate(locale, 'errors.notFound.user'));
    }

    // If there is an existing, non-expired code, use that since we record attempts for security
    let verificationCode: VerificationCode;
    if (user.verificationCode && user.verificationCode.expiry > Date.now()) {
      verificationCode = user.verificationCode;
    } else {
      verificationCode = {
        attemptsMade: 0,
        expiry: Date.now() + parseInt(this.config.getOrThrow('VALIDATION_TIMEOUT')),
        value: randomInt(100000, 1000000)
      };
      await user.updateOne({ verificationCode });
    }

    await this.mailService.sendMail({
      to: user.email,
      subject: this.i18n.translate(locale, 'verificationEmail.body'),
      text: this.i18n.translate(locale, 'verificationEmail.body') + '\n\n' + `Code : ${verificationCode.value}`
    });
    return { attemptsMade: verificationCode.attemptsMade, expiry: verificationCode.expiry };
  }

  async verifyAccount({ code }: VerifyAccountDto, { email }: CurrentUser, locale?: Locale) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(this.i18n.translate(locale, 'errors.notFound.user'));
    } else if (!user.verificationCode) {
      throw new ForbiddenException(this.i18n.translate(locale, 'errors.forbidden.undefinedCode'));
    }

    const isExpired = user.verificationCode.expiry < Date.now();
    if (isExpired) {
      throw new ForbiddenException(this.i18n.translate(locale, 'errors.forbidden.expiredCode'));
    }

    const maxAttempts = parseInt(this.config.get('MAX_VALIDATION_ATTEMPTS')!);
    if (!maxAttempts) {
      throw new InternalServerErrorException(
        `Environment variable 'MAX_VALIDATION_ATTEMPTS' must be set to a positive integer, not ${
          this.config.get('MAX_VALIDATION_ATTEMPTS') as string
        }`
      );
    }

    if (user.verificationCode.attemptsMade > maxAttempts) {
      throw new ForbiddenException(this.i18n.translate(locale, 'errors.forbidden.tooManyAttempts'));
    }

    if (user.verificationCode.value !== code) {
      user.verificationCode.attemptsMade++;
      await user.save();
      throw new ForbiddenException(this.i18n.translate(locale, 'errors.forbidden.incorrectCode'));
    }

    await user.updateOne({ verificationCode: undefined, verifiedAt: Date.now(), isVerified: true });
  }
}

import { randomInt } from 'crypto';

import type { AuthPayload, CurrentUser, EmailConfirmationProcedureInfo, Locale } from '@databank/types';
import { CryptoService } from '@douglasneuroinformatics/nestjs/modules';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { ConfirmEmailInfo, User } from '@prisma/client';

import { I18nService } from '@/i18n/i18n.service';
import { MailService } from '@/mail/mail.service';
import { SetupService } from '@/setup/setup.service';

import { UsersService } from '../users/users.service.js';
import { CreateAccountDto } from './dto/create-account.dto.js';
import { VerifyAccountDto } from './dto/verify-account.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly crypto: CryptoService,
    private readonly i18n: I18nService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
    private readonly setupService: SetupService
  ) {}

  /** Create a new standard account with verification required */
  async createAccount(createAccountDto: CreateAccountDto): Promise<Omit<User, 'hashedPassword'>> {
    return this.usersService.createUser({
      ...createAccountDto,
      role: 'STANDARD'
    });
  }

  async login(email: string, password: string): Promise<AuthPayload> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const isCorrectPassword = await this.crypto.comparePassword(password, user.hashedPassword);
    if (!isCorrectPassword) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const accessToken = await this.signToken(user);

    return { accessToken };
  }

  async sendConfirmEmailCode({ email }: CurrentUser, locale?: Locale): Promise<EmailConfirmationProcedureInfo> {
    // This should never happen when called from controller, but in case it is ever called elsewhere
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    // If there is an existing, non-expired code, use that since we record attempts for security
    let confirmEmailInfo: ConfirmEmailInfo;
    if (user.confirmEmailInfo && user.confirmEmailInfo.expiryAt > new Date(Date.now())) {
      confirmEmailInfo = user.confirmEmailInfo;
    } else {
      confirmEmailInfo = {
        attemptsMade: 0,
        confirmEmailCode: randomInt(100000, 1000000),
        expiryAt: new Date(Date.now() + parseInt(this.config.getOrThrow('VALIDATION_TIMEOUT')))
      };
      await this.usersService.updateConfirmEmailInfo(user.email, confirmEmailInfo);
    }

    await this.mailService.sendMail({
      subject: this.i18n.translate(locale, 'confirmationEmail.body'),
      text:
        this.i18n.translate(locale, 'confirmationEmail.body') + '\n\n' + `Code : ${confirmEmailInfo.confirmEmailCode}`,
      to: user.email
    });
    return { attemptsMade: confirmEmailInfo.attemptsMade, expiry: confirmEmailInfo.expiryAt };
  }

  async verifyAccount({ code }: VerifyAccountDto, { email }: CurrentUser): Promise<AuthPayload> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User Not Found');
    } else if (!user.confirmEmailInfo) {
      throw new ForbiddenException('Validation code is undefined. Please request a validation code.');
    }

    const isExpired = user.confirmEmailInfo.expiryAt < new Date(Date.now());
    if (isExpired) {
      throw new ForbiddenException('Validation code is expired. Please request a new validation code.');
    }

    const maxAttempts = parseInt(this.config.get('MAX_VALIDATION_ATTEMPTS')!);
    if (!maxAttempts) {
      throw new InternalServerErrorException(
        `Environment variable 'MAX_VALIDATION_ATTEMPTS' must be set to a positive integer, not ${this.config.get(
          'MAX_VALIDATION_ATTEMPTS'
        )!}`
      );
    }

    if (user.confirmEmailInfo.attemptsMade > maxAttempts) {
      throw new ForbiddenException(
        'Too many attempts to validate this code. Please request a new validation code after the timeout.'
      );
    }

    if (user.confirmEmailInfo?.confirmEmailCode !== code) {
      await this.usersService.updateConfirmEmailInfo(user.email, {
        ...user.confirmEmailInfo,
        attemptsMade: ++user.confirmEmailInfo.attemptsMade
      });
      throw new ForbiddenException('Incorrect validation code. Please try again.');
    }

    await this.usersService.updateConfirmEmailInfo(user.email, null);
    user.confirmedAt = new Date(Date.now());

    /** Now the user has confirm their email, verify the user according to the verification method set by the admin */
    const verificationInfo = await this.setupService.getVerificationInfo();
    let isVerified: boolean;

    if (verificationInfo.method === 'CONFIRM_EMAIL') {
      isVerified = true;
    } else if (verificationInfo.method === 'REGEX_EMAIL' && verificationInfo.emailRegex) {
      isVerified = new RegExp(verificationInfo.emailRegex).test(user.email) ? true : false;
    } else {
      throw new Error(`Unexpected verification method: ${verificationInfo.method}`);
    }

    if (isVerified) {
      await this.usersService.setVerified(user.email);
    }

    const accessToken = await this.signToken(user);

    return { accessToken };
  }

  private async signToken(user: User) {
    const { confirmedAt, email, firstName, lastName, role, verifiedAt } = user;
    const payload: CurrentUser = { confirmedAt, email, firstName, id: user.id, lastName, role, verifiedAt };
    return this.jwtService.signAsync(payload);
  }
}

import { afterEach, beforeEach, describe, expect, it, jest } from 'bun:test';

import type { CreateAccountDto } from '../dto/create-account.dto';
import type { VerifyAccountDto } from '../dto/verify-account.dto';
import type { CurrentUser, Locale } from '@databank/types';
import { CryptoService } from '@douglasneuroinformatics/nestjs/modules';
import { type MockedInstance, createMock } from '@douglasneuroinformatics/nestjs/testing';
import { ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { I18nService } from '@/i18n/i18n.service';
import { MailService } from '@/mail/mail.service';
import { SetupConfig } from '@/setup/schemas/setup-config.schema';
import { SetupService } from '@/setup/setup.service';
import { createUserDtoStubFactory } from '@/users/__tests__/stubs/create-user.dto.stub';
import type { CreateUserDto } from '@/users/dto/create-user.dto';
import type { User } from '@/users/schemas/user.schema';
import { UsersService } from '@/users/users.service';

import { AuthService } from '../auth.service';
import { createAccountDtoStubFactory } from './stubs/create-account.dto.stub';
import { currentUserStubFactory } from './stubs/current-user.stub';
import { verifyAccountStubFactory } from './stubs/verify-account.dto.stub';

const validDate = Date.now() + 360000;
const expiredDate = Date.now() - 10000;

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: MockedInstance<UsersService>;
  let cryptoService: MockedInstance<CryptoService>;
  let jwtService: MockedInstance<JwtService>;
  let setupService: MockedInstance<SetupService>;
  let configService: MockedInstance<ConfigService>;

  // called before every test to intialize the AuthService
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
            getOrThrow: jest.fn()
          }
        },
        {
          provide: CryptoService,
          useValue: createMock(CryptoService)
        },
        {
          provide: I18nService,
          useValue: createMock(I18nService)
        },
        { provide: JwtService, useValue: createMock(JwtService) },
        {
          provide: MailService,
          useValue: createMock(MailService)
        },
        {
          provide: UsersService,
          useValue: createMock(UsersService)
        },
        {
          provide: SetupService,
          useValue: createMock(SetupService)
        }
      ]
    }).compile();
    // get all the services we need from the moduleRef
    authService = moduleRef.get(AuthService);
    usersService = moduleRef.get(UsersService);
    cryptoService = moduleRef.get(CryptoService);
    jwtService = moduleRef.get(JwtService);
    setupService = moduleRef.get(SetupService);
    configService = moduleRef.get(ConfigService);

    createAccountDto = createAccountDtoStubFactory();
    createUserDto = createUserDtoStubFactory();
    verifyAccountDto = verifyAccountStubFactory();
    currentUser = currentUserStubFactory();
    jwtService.signAsync.mockResolvedValue('accessToken');
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  let createAccountDto: CreateAccountDto;
  let createUserDto: CreateUserDto;
  let verifyAccountDto: VerifyAccountDto;
  let currentUser: CurrentUser;

  describe('createAccount', () => {
    it('calls the usersService.createUser and returns the created account', async () => {
      const mockUser = {
        ...createAccountDto,
        confirmedAt: null,
        role: 'standard',
        verifiedAt: null
      };
      usersService.createUser.mockResolvedValue(mockUser);
      const result = await authService.createAccount(createAccountDto);
      expect(result).toMatchObject(mockUser);
    });
  });

  describe('login', () => {
    beforeEach(() => {
      // can use spyOn insead: spyOn(usersService, 'findByEmail').mockResolvedValue(createUserDto);
      usersService.findByEmail.mockReturnValue({ select: () => Promise.resolve(createUserDto) });
      cryptoService.comparePassword.mockResolvedValue(true);
    });

    afterEach(() => {
      usersService.findByEmail.mockClear();
      cryptoService.comparePassword.mockClear();
    });

    it('should throw an UnauthorizedException when given an invalid email when calling usersService.findByEmail', () => {
      const { password } = createUserDto;
      usersService.findByEmail.mockReturnValue({ select: () => Promise.resolve(undefined) });
      const result = authService.login('invalid@example.com', password);
      expect(result).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('should throw an UnauthorizedException when given an invalid password when calling cryptoService.comparePassword', () => {
      const { email } = createUserDto;
      cryptoService.comparePassword.mockResolvedValue(false);
      expect(authService.login(email, 'invalidPassword')).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('should return an access token when given valid credentials', async () => {
      const { email, password } = createUserDto;
      const result = await authService.login(email, password);
      expect(result.accessToken).toEqual('accessToken');
    });
  });

  describe('sendConfirmEmailCode', () => {
    afterEach(() => {
      usersService.findByEmail.mockClear();
    });

    const locale: Locale = 'en';

    it('should throw NotFoundException if the user is not found when calling usersService.findByEmail', () => {
      usersService.findByEmail.mockResolvedValue(undefined);
      expect(authService.sendConfirmEmailCode(currentUser, locale)).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should use an existing verification code if the date is not expired', async () => {
      const user: User = {
        confirmEmailCode: {
          attemptsMade: 0,
          expiry: validDate,
          value: 456
        },
        confirmedAt: null,
        email: 'test@example.com',
        firstName: 'Test',
        hashedPassword: 'hashedPassword',
        lastName: 'User',
        role: 'standard',
        verifiedAt: null
      };
      usersService.findByEmail.mockResolvedValue(user);
      const result = await authService.sendConfirmEmailCode(currentUser, locale);
      // check to see if the logic inside sendConfirmEmailCode works with a valid date
      expect(result.attemptsMade).toBe(0);
      expect(result.expiry).toBe(validDate);
    });

    it('should update the user.verificationCode when the date is expired', async () => {
      // Use Record<string, any> to have updateOne function within the User type
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user: User & Record<string, any> = {
        confirmEmailCode: {
          attemptsMade: 0,
          expiry: expiredDate,
          value: 456
        },
        confirmedAt: null,
        email: 'test@example.com',
        firstName: 'Test',
        hashedPassword: 'hashedPassword',
        lastName: 'User',
        role: 'standard',
        updateOne: () => null,
        verifiedAt: null
      };

      // Mock the 'VALIDATION_TIMEOUT' that is in .env file
      configService.getOrThrow.mockReturnValueOnce(36000);
      // Mock the mongoose updateOne() function
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
      const mockUpdateOne = jest.fn(() => user.updateOne());
      // The resolved value can be anything
      mockUpdateOne.mockResolvedValue({});
      usersService.findByEmail.mockResolvedValue(user);
      const result = await authService.sendConfirmEmailCode(currentUser, locale);
      // check to see if the logic inside sendConfirmEmailCode works with an expired date
      expect(result.attemptsMade).toBe(0);
      expect(result.expiry).toBeGreaterThanOrEqual(Date.now());
      mockUpdateOne.mockClear();
    });
  });

  describe('verifyAccount()', () => {
    afterEach(() => {
      usersService.findByEmail.mockClear();
    });

    it('should throw NotFoundException if the user is not found when calling usersService.findByEmail', () => {
      usersService.findByEmail.mockResolvedValue(undefined);
      expect(authService.verifyAccount(verifyAccountDto, currentUser)).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should throw ForbiddenException when a verification code is undefined', () => {
      // Set the verificationCode object to be undefined
      const user: User = {
        confirmEmailCode: undefined,
        confirmedAt: null,
        email: 'test@example.com',
        firstName: 'Test',
        hashedPassword: 'hashedPassword',
        lastName: 'User',
        role: 'standard',
        verifiedAt: null
      };
      usersService.findByEmail.mockResolvedValue(user);
      const result = authService.verifyAccount(verifyAccountDto, currentUser);
      expect(result).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('should throw ForbiddenException if the verificationCode.expiry < Date.now()', () => {
      const user: User = {
        confirmEmailCode: {
          attemptsMade: 0,
          expiry: expiredDate,
          value: 456
        },
        confirmedAt: null,
        email: 'test@example.com',
        firstName: 'Test',
        hashedPassword: 'hashedPassword',
        lastName: 'User',
        role: 'standard',
        verifiedAt: null
      };
      usersService.findByEmail.mockResolvedValue(user);
      const result = authService.verifyAccount(verifyAccountDto, currentUser);
      expect(result).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('should throw ForbiddenException if the maximum log in attempts is exceeded', () => {
      //  Set the attemptsMade number to be larger than the maximum attempts
      const exceededAttempts = 4;
      const user: User = {
        confirmEmailCode: {
          attemptsMade: exceededAttempts,
          expiry: validDate,
          value: 456
        },
        confirmedAt: null,
        email: 'test@example.com',
        firstName: 'Test',
        hashedPassword: 'hashedPassword',
        lastName: 'User',
        role: 'standard',
        verifiedAt: null
      };

      // Mock the MAX_VALIDATION_ATTEMPTS that is in the .env file
      configService.get.mockReturnValueOnce(3);
      usersService.findByEmail.mockResolvedValue(user);
      const result = authService.verifyAccount(verifyAccountDto, currentUser);
      expect(result).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('should throw ForbiddenException if user.confirmEmailCode.value does not equal VerifyAccountDto.code', () => {
      //  Set the verificationCode.value to not be equal to the passed in user.
      const wrongVerificationCodeValue = 456;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user: User & Record<string, any> = {
        confirmEmailCode: {
          attemptsMade: 1,
          expiry: validDate,
          value: wrongVerificationCodeValue
        },
        confirmedAt: null,
        email: 'test@example.com',
        firstName: 'Test',
        hashedPassword: 'hashedPassword',
        lastName: 'User',
        role: 'standard',
        save: () => null,
        verifiedAt: null
      };

      // Mock the MAX_VALIDATION_ATTEMPTS that is in the .env file
      configService.get.mockReturnValueOnce(3);
      // mock the mongoose save() function
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
      const mockSave = jest.fn(() => user.save());
      mockSave.mockResolvedValue({});
      usersService.findByEmail.mockResolvedValue(user);
      const result = authService.verifyAccount(verifyAccountDto, currentUser);
      expect(result).rejects.toBeInstanceOf(ForbiddenException);
      mockSave.mockClear();
    });

    it('should return the accessToken when the user is succesfully verified', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user: User & Record<string, any> = {
        confirmEmailCode: {
          attemptsMade: 1,
          expiry: validDate,
          value: 123
        },
        confirmedAt: null,
        email: 'test@example.com',
        firstName: 'Test',
        hashedPassword: 'hashedPassword',
        lastName: 'User',
        role: 'standard',
        save: () => null,
        verifiedAt: 0
      };

      const setupConfigModel: SetupConfig = {
        verificationInfo: {
          kind: 'VERIFICATION_UPON_CONFIRM_EMAIL'
        }
      };

      // Mock the MAX_VALIDATION_ATTEMPTS that is in the .env file
      configService.get.mockReturnValueOnce(3);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
      const mockSave = jest.fn(() => user.save());
      mockSave.mockResolvedValue({});
      usersService.findByEmail.mockResolvedValue(user);
      setupService.getVerificationInfo.mockResolvedValue(setupConfigModel.verificationInfo);
      const result = await authService.verifyAccount(verifyAccountDto, currentUser);
      expect(user.confirmEmailCode).toBeUndefined();
      expect(user.confirmedAt).toBeWithin(Date.now() - 10000, Date.now() + 10000);
      expect(user.verifiedAt).toBeWithin(Date.now(), validDate + 10000);
      expect(result.accessToken).toEqual('accessToken');
      mockSave.mockClear();
    });
  });
});

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

  // called before every test to intialize the AuthService
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: (propertyPath: string) => propertyPath
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
        }
      ]
    }).compile();
    // get all the services we need from the moduleRef
    authService = moduleRef.get(AuthService);
    usersService = moduleRef.get(UsersService);
    cryptoService = moduleRef.get(CryptoService);
    jwtService = moduleRef.get(JwtService);

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
        isVerified: false,
        role: 'standard'
      };
      usersService.createUser.mockResolvedValue(mockUser);
      const result = await authService.createAccount(createAccountDto);
      expect(result).toMatchObject(mockUser);
    });
  });

  describe('login', () => {
    beforeEach(() => {
      // can use spyOn insead: spyOn(usersService, 'findByEmail').mockResolvedValue(createUserDto);
      usersService.findByEmail.mockResolvedValue(createUserDto);
      cryptoService.comparePassword.mockResolvedValue(true);
    });

    afterEach(() => {
      usersService.findByEmail.mockClear();
      cryptoService.comparePassword.mockClear();
    });

    it('should throw an UnauthorizedException when given an invalid email when calling usersService.findByEmail', () => {
      const { password } = createUserDto;
      usersService.findByEmail.mockResolvedValue(undefined);
      expect(authService.login('invalid@example.com', password)).rejects.toBeInstanceOf(UnauthorizedException);
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

  describe('sendVerificationCode', () => {
    afterEach(() => {
      usersService.findByEmail.mockClear();
    });

    const locale: Locale = 'en';

    it('should throw NotFoundException if the user is not found when calling usersService.findByEmail', () => {
      usersService.findByEmail.mockResolvedValue(undefined);
      expect(authService.sendVerificationCode(currentUser, locale)).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should use an existing verification code if the date is not expired', async () => {
      const user: User = {
        email: 'test@example.com',
        firstName: 'Test',
        hashedPassword: 'hashedPassword',
        isVerified: true,
        lastName: 'User',
        role: 'standard',
        verificationCode: {
          attemptsMade: 0,
          expiry: validDate,
          value: 456
        }
      };
      usersService.findByEmail.mockResolvedValue(user);
      const result = await authService.sendVerificationCode(currentUser, locale);
      // check to see if the logic inside sendVerificationCode works with a valid date
      expect(result.attemptsMade).toBe(0);
      expect(result.expiry).toBe(validDate);
    });

    it('should update the user.verificationCode when the date is expired', async () => {
      // Use Record<string, any> to have updateOne function within the User type
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user: User & Record<string, any> = {
        email: 'test@example.com',
        firstName: 'Test',
        hashedPassword: 'hashedPassword',
        isVerified: true,
        lastName: 'User',
        role: 'standard',
        updateOne: () => null,
        verificationCode: {
          attemptsMade: 0,
          expiry: expiredDate,
          value: 456
        }
      };

      // Mock the mongoose updateOne() function
      const mockUpdateOne = jest.fn(() => user.updateOne());
      // The resolved value can be anything
      mockUpdateOne.mockResolvedValue({});
      usersService.findByEmail.mockResolvedValue(user);
      const result = await authService.sendVerificationCode(currentUser, locale);
      // check to see if the logic inside sendVerificationCode works with an expired date
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
        email: 'test@example.com',
        firstName: 'Test',
        hashedPassword: 'hashedPassword',
        isVerified: true,
        lastName: 'User',
        role: 'standard',
        verificationCode: undefined
      };
      usersService.findByEmail.mockResolvedValue(user);
      const result = authService.verifyAccount(verifyAccountDto, currentUser);
      expect(result).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('should throw ForbiddenException if the verificationCode.expiry < Date.now()', () => {
      const user: User = {
        email: 'test@example.com',
        firstName: 'Test',
        hashedPassword: 'hashedPassword',
        isVerified: true,
        lastName: 'User',
        role: 'standard',
        verificationCode: {
          attemptsMade: 0,
          expiry: expiredDate,
          value: 456
        }
      };
      usersService.findByEmail.mockResolvedValue(user);
      const result = authService.verifyAccount(verifyAccountDto, currentUser);
      expect(result).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('should throw ForbiddenException if the maximum log in attempts is exceeded', () => {
      //  Set the attemptsMade number to be larger than the maximum attempts
      const exceededAttempts = 4;
      const user: User = {
        email: 'test@example.com',
        firstName: 'Test',
        hashedPassword: 'hashedPassword',
        isVerified: true,
        lastName: 'User',
        role: 'standard',
        verificationCode: {
          attemptsMade: exceededAttempts,
          expiry: validDate,
          value: 456
        }
      };
      usersService.findByEmail.mockResolvedValue(user);
      const result = authService.verifyAccount(verifyAccountDto, currentUser);
      expect(result).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('should throw ForbiddenException if user.verficationCode.value does not equal VerifyAccountDto.code', () => {
      //  Set the verificationCode.value to not be equal to the passed in user.
      const wrongVerificationCodeValue = 456;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user: User & Record<string, any> = {
        email: 'test@example.com',
        firstName: 'Test',
        hashedPassword: 'hashedPassword',
        isVerified: true,
        lastName: 'User',
        role: 'standard',
        save: () => null,
        verificationCode: {
          attemptsMade: 1,
          expiry: validDate,
          value: wrongVerificationCodeValue
        }
      };
      // mock the mongoose save() function
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
        email: 'test@example.com',
        firstName: 'Test',
        hashedPassword: 'hashedPassword',
        isVerified: false,
        lastName: 'User',
        role: 'standard',
        save: () => null,
        verificationCode: {
          attemptsMade: 1,
          expiry: validDate,
          value: 123
        },
        verifiedAt: 0
      };
      const mockSave = jest.fn(() => user.save());
      mockSave.mockResolvedValue({});
      usersService.findByEmail.mockResolvedValue(user);
      const result = await authService.verifyAccount(verifyAccountDto, currentUser);
      expect(user.verificationCode).toBeUndefined();
      expect(user.verifiedAt).toBeWithin(Date.now(), validDate + 10000);
      expect(user.isVerified).toBeTrue();
      expect(result.accessToken).toEqual('accessToken');
      mockSave.mockClear();
    });
  });
});

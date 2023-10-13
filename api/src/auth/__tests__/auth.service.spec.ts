import { beforeEach, describe, expect, it, spyOn } from 'bun:test';

import type { CreateAccountDto } from '../dto/create-account.dto';
import { CryptoService } from '@douglasneuroinformatics/nestjs/modules';
import { type MockedInstance, createMock } from '@douglasneuroinformatics/nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { I18nService } from '@/i18n/i18n.service';
import { MailService } from '@/mail/mail.service';
import { createUserDtoStubFactory } from '@/users/__tests__/stubs/create-user.dto.stub';
import type { CreateUserDto } from '@/users/dto/create-user.dto';
import { UsersService } from '@/users/users.service';

import { AuthService } from '../auth.service';
import { createAccountDtoStubFactory } from './stubs/create-account.dto.stub';

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
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  let createAccountDto: CreateAccountDto;
  let createUserDto: CreateUserDto;

  beforeEach(() => {
    createAccountDto = createAccountDtoStubFactory();
    createUserDto = createUserDtoStubFactory();
  });

  describe('createAccount', () => {
    it('calls the usersService.createUser and returns the created account', async () => {
      usersService.createUser.mockResolvedValue({
        ...createAccountDto,
        isVerified: false,
        role: 'standard'
      });

      const result = await authService.createAccount(createAccountDto);
      expect(result).toMatchObject({
        ...createAccountDto,
        isVerified: false,
        role: 'standard'
      });
    });
  });

  describe('login', () => {
    beforeEach(() => {
      spyOn(usersService, 'findByEmail').mockResolvedValue(createUserDto);
      spyOn(cryptoService, 'comparePassword').mockResolvedValue(true);
      spyOn(jwtService, 'signAsync').mockResolvedValue('accessToken');
    });

    it('should throw an UnauthorizedException when given an invalid email when calling usersService.findByEmail', () => {
      const password = createUserDto.password;
      usersService.findByEmail.mockResolvedValue(undefined);
      expect(authService.login('invalid@example.com', password)).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('should throw an UnauthorizedException when given an invalid password when calling cryptoService.comparePassword', () => {
      const email = createUserDto.email;
      cryptoService.comparePassword.mockResolvedValue(false);
      expect(authService.login(email, 'inalidPassword')).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('should return an access token when given valid credentials', async () => {
      const { email, password } = createUserDto;
      const result = await authService.login(email, password);
      expect(result.accessToken).toEqual('accessToken');
    });
  });
});
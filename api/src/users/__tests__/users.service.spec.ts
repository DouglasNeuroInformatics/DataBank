import { type AnyFunction } from 'bun';
import { type Mock, beforeEach, describe, expect, it, jest } from 'bun:test';

import { CryptoService } from '@douglasneuroinformatics/nestjs/modules';
import { ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { UsersService } from '../users.service';
import { createUserDtoStubFactory } from './stubs/create-user.dto.stub';

import type { CreateUserDto } from '../schemas/user';

describe('UsersService', () => {
  let usersService: UsersService;
  let prisma: {
    user: {
      create: Mock<AnyFunction>,
      findMany: Mock<AnyFunction>,
      findUnique: Mock<AnyFunction>
    }
  };
  const mockCrypto = {
    comparePassword: jest.fn().mockResolvedValue(true),
    hash: jest.fn().mockResolvedValue('hello'),
    hashPassword: jest.fn().mockResolvedValue('hello')
  }

  // let cryptoService: CryptoService;

  beforeEach(async () => {
    console.log(CryptoService.name)
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'prisma',
          useValue: {
            user: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn()
            }
          }
        },
        {
          provide: CryptoService,
          useValue: mockCrypto
        }
      ]
    }).compile();
    prisma = moduleRef.get('prisma');
    // cryptoService = moduleRef.get<CryptoService>(CryptoService);
    usersService = moduleRef.get(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('createUser', () => {
    let createUserDto: CreateUserDto;

    beforeEach(() => {
      createUserDto = createUserDtoStubFactory();
    });

    it('should throw a conflict exception if the user already exists', () => {
      prisma.user.findUnique.mockResolvedValueOnce(createUserDto);
      expect(usersService.createUser(createUserDto)).rejects.toBeInstanceOf(ConflictException);
    });

    it('should return an object that containers neither a password or hashedPassword', async () => {
      prisma.user.create.mockImplementationOnce((args) => args as unknown);
      const createdUser = await usersService.createUser(createUserDto);
      expect(Object.keys(createdUser)).not.toContain('password');
      expect(Object.keys(createdUser)).not.toContain('hashedPassword');
    });
  });
});

import type { CreateUser } from '@databank/core';
import { CryptoService, getModelToken } from '@douglasneuroinformatics/libnest';
import { ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { Prisma, User } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';

import { UsersService } from '../users.service.js';
import { createUserDtoStubFactory } from './stubs/create-user.dto.stub.js';

describe('UsersService', () => {
  let usersService: UsersService;
  let userModel: {
    create: Mock;
    findMany: Mock;
    findUnique: Mock;
  };
  const mockCrypto = {
    comparePassword: vi.fn(),
    hash: vi.fn(),
    hashPassword: vi.fn().mockImplementation((password: string) => {
      return password + 'WOW';
    })
  };

  // let cryptoService: CryptoService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: {
            create: vi.fn(),
            findMany: vi.fn(),
            findUnique: vi.fn()
          }
        },
        {
          provide: CryptoService,
          useValue: mockCrypto
        }
      ]
    }).compile();
    userModel = moduleRef.get('UserPrismaModel');
    usersService = moduleRef.get(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('createUser', () => {
    let createUserDto: CreateUser;

    beforeEach(() => {
      createUserDto = createUserDtoStubFactory();
    });

    it('should throw a conflict exception if the user already exists', async () => {
      userModel.findUnique.mockResolvedValueOnce(createUserDto);
      await expect(usersService.createUser(createUserDto)).rejects.toBeInstanceOf(ConflictException);
    });

    it('should return an object that containers neither a password or hashedPassword', async () => {
      userModel.create.mockImplementationOnce((args) => args as unknown);
      const createdUser = await usersService.createUser(createUserDto);
      expect(Object.keys(createdUser)).not.toContain('password');
      expect(Object.keys(createdUser)).not.toContain('hashedPassword');
    });

    describe('findByEmail', () => {
      it('should return the user object with the input email', async () => {
        userModel.findUnique.mockReturnValueOnce({ email: 'johnsmith@gmail.com' });
        await expect(usersService.findByEmail('johnsmith@gmail.com')).resolves.toEqual({
          email: 'johnsmith@gmail.com'
        } as unknown as Prisma.Prisma__UserClient<User>);
      });
    });

    describe('getAll', () => {
      it('should return all users in the database', async () => {
        userModel.findMany.mockImplementationOnce(() => {
          return [{ email: 'johnsmith@gmail.com' }, { email: 'abc@outlook.com' }];
        });
        await expect(usersService.getAll()).resolves.toEqual([
          { email: 'johnsmith@gmail.com' },
          { email: 'abc@outlook.com' }
        ] as unknown as Promise<User[]>);
      });
    });
  });
});

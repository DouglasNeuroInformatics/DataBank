import { CryptoService } from '@douglasneuroinformatics/libnest/modules';
import { ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { type Prisma, type User } from '@prisma/client';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import { UsersService } from '../users.service.js';
import { createUserDtoStubFactory } from './stubs/create-user.dto.stub.js';

import type { CreateUserDto } from '../zod/user.js';

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
          provide: 'prismaUser',
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
    userModel = moduleRef.get('prismaUser');
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
      it('should return the user object with the input email', () => {
        userModel.findUnique.mockReturnValueOnce({ email: 'johnsmith@gmail.com' });
        expect(usersService.findByEmail('johnsmith@gmail.com')).toEqual({
          email: 'johnsmith@gmail.com'
        } as unknown as Prisma.Prisma__UserClient<User>);
      });
    });

    describe('getAll', () => {
      it('should return all users in the database', () => {
        userModel.findMany.mockImplementationOnce(() => {
          return [{ email: 'johnsmith@gmail.com' }, { email: 'abc@outlook.com' }];
        });
        expect(usersService.getAll()).toEqual([
          { email: 'johnsmith@gmail.com' },
          { email: 'abc@outlook.com' }
        ] as unknown as Promise<User[]>);
      });
    });
  });
});

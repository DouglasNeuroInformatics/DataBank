import type { AnyFunction } from 'bun';
import { type Mock, beforeEach, describe, expect, it, jest } from 'bun:test';

import { CryptoService } from '@douglasneuroinformatics/nestjs/modules';
import { createMock } from '@douglasneuroinformatics/nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';

import { User } from '../schemas/user.schema';
import { UsersService } from '../users.service';
import { createUserDtoStubFactory } from './stubs/create-user.dto.stub';

import type { CreateUserDto } from '../dto/create-user.dto';

describe('UsersService', () => {
  let usersService: UsersService;
  let userModel: {
    create: Mock<AnyFunction>;
    exists: Mock<AnyFunction>;
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            create: jest.fn(),
            exists: jest.fn()
          }
        },
        {
          provide: CryptoService,
          useValue: createMock(CryptoService)
        }
      ]
    }).compile();
    userModel = moduleRef.get(getModelToken(User.name));
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
      userModel.exists.mockResolvedValueOnce(true);
      expect(usersService.createUser(createUserDto)).rejects.toBeInstanceOf(ConflictException);
    });

    it('should return an object that containers neither a password or hashedPassword', async () => {
      userModel.create.mockImplementationOnce((args) => args as unknown);
      const createdUser = await usersService.createUser(createUserDto);
      expect(Object.keys(createdUser)).not.toContain('password');
      expect(Object.keys(createdUser)).not.toContain('hashedPassword');
    });
  });
});

import { beforeEach, describe, expect, it } from 'bun:test';

import { type MockedInstance, createMock } from '@douglasneuroinformatics/nestjs/testing';
import { Test } from '@nestjs/testing';

import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { createUserDtoStubFactory } from './stubs/create-user.dto.stub';

import type { CreateUserDto } from '../dto/create-user.dto';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: MockedInstance<UsersService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: createMock(UsersService)
        }
      ]
    }).compile();
    usersController = moduleRef.get(UsersController);
    usersService = moduleRef.get(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
    expect(usersService).toBeDefined();
  });

  describe('createUser', () => {
    let createUserDto: CreateUserDto;

    beforeEach(() => {
      createUserDto = createUserDtoStubFactory();
    });

    it('should return the same value as returned by the service', () => {
      usersService.createUser.mockResolvedValueOnce(createUserDto);
      expect(usersController.createUser(createUserDto)).resolves.toMatchObject(createUserDto);
    });
  });
});

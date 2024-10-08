import { type MockedInstance, MockFactory } from '@douglasneuroinformatics/libnest/testing';
import { Test } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { UsersController } from '../users.controller.js';
import { UsersService } from '../users.service.js';
import { createUserDtoStubFactory } from './stubs/create-user.dto.stub.js';

import type { CreateUserDto } from '../zod/user.js';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: MockedInstance<UsersService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [MockFactory.createForService(UsersService)]
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

    it('should return the same value as returned by the service', async () => {
      usersService.createUser.mockResolvedValueOnce(createUserDto);
      await expect(usersController.createUser(createUserDto)).resolves.toMatchObject(createUserDto);
    });
  });
});

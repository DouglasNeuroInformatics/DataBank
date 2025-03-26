import type { SetupOptions } from '@databank/core';
import { getModelToken } from '@douglasneuroinformatics/libnest';
import type { Model } from '@douglasneuroinformatics/libnest';
import { MockFactory } from '@douglasneuroinformatics/libnest/testing';
import type { MockedInstance } from '@douglasneuroinformatics/libnest/testing';
import { HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { DatasetsService } from '@/datasets/datasets.service';
import { UsersService } from '@/users/users.service';

import { SetupService } from '../setup.service';

describe('SetupService', () => {
  let setupConfigModel: MockedInstance<Model<'SetupConfig'>>;
  let setupService: SetupService;
  let usersService: MockedInstance<UsersService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MockFactory.createForModelToken(getModelToken('SetupConfig')),
        MockFactory.createForService(DatasetsService),
        MockFactory.createForService(UsersService),
        SetupService
      ]
    }).compile();
    setupConfigModel = moduleRef.get(getModelToken('SetupConfig'));
    setupService = moduleRef.get(SetupService);
    usersService = moduleRef.get(UsersService);
  });

  describe('getState', () => {
    it('should return that the app is not setup if there are no items in the setup collection', async () => {
      setupConfigModel.count.mockResolvedValueOnce(0);
      await expect(setupService.getState()).resolves.toStrictEqual({ isSetup: false });
    });
    it('should return that the app is setup if there are one or more items in the setup collection', async () => {
      setupConfigModel.count.mockResolvedValueOnce(1);
      await expect(setupService.getState()).resolves.toStrictEqual({ isSetup: true });
    });
  });

  describe('getVerificationStrategy', () => {
    it('should throw a ServiceUnavailableException if the app has not been setup', async () => {
      setupConfigModel.findFirst.mockResolvedValueOnce(null);
      await expect(setupService.getVerificationStrategy()).rejects.toMatchObject({
        status: HttpStatus.SERVICE_UNAVAILABLE
      });
    });
    it('should return the result from the db if it exists', async () => {
      setupConfigModel.findFirst.mockResolvedValueOnce({ verificationStrategy: 'STRATEGY' });
      await expect(setupService.getVerificationStrategy()).resolves.toBe('STRATEGY');
    });
  });

  describe('initApp', () => {
    const setupOptions: SetupOptions = {
      admin: {
        email: 'jane.doe@example.org',
        firstName: 'Jane',
        lastName: 'Doe',
        password: 'Password123'
      },
      setupConfig: {
        verificationStrategy: {
          kind: 'MANUAL'
        }
      }
    };

    it('should throw a ForbiddenException if the app is already setup', async () => {
      setupConfigModel.count.mockReturnValueOnce(1);
      await expect(setupService.initApp(setupOptions)).rejects.toMatchObject({
        status: HttpStatus.FORBIDDEN
      });
    });

    it('should ', async () => {
      setupConfigModel.count.mockReturnValueOnce(0);
      usersService.createUser.mockResolvedValueOnce({
        id: '1'
      });
      await setupService.initApp(setupOptions);
      expect(usersService.createUser).toHaveBeenCalledOnce();
    });
  });
});

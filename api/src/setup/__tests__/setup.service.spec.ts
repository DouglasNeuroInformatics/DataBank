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
  let setupModel: MockedInstance<Model<'Setup'>>;
  let setupService: SetupService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MockFactory.createForModelToken(getModelToken('Setup')),
        MockFactory.createForService(DatasetsService),
        MockFactory.createForService(UsersService),
        SetupService
      ]
    }).compile();
    setupModel = moduleRef.get(getModelToken('Setup'));
    setupService = moduleRef.get(SetupService);
  });

  describe('getState', () => {
    it('should return that the app is not setup if there are no items in the setup collection', async () => {
      setupModel.count.mockResolvedValueOnce(0);
      await expect(setupService.getState()).resolves.toStrictEqual({ isSetup: false });
    });
    it('should return that the app is setup if there are one or more items in the setup collection', async () => {
      setupModel.count.mockResolvedValueOnce(1);
      await expect(setupService.getState()).resolves.toStrictEqual({ isSetup: true });
    });
  });

  describe('getVerificationStrategy', () => {
    it('should throw a ServiceUnavailableException if the app has not been setup', async () => {
      setupModel.findFirst.mockResolvedValueOnce(null);
      await expect(setupService.getVerificationStrategy()).rejects.toMatchObject({
        status: HttpStatus.SERVICE_UNAVAILABLE
      });
    });
    it('should return the result from the db if it exists', async () => {
      setupModel.findFirst.mockResolvedValueOnce({ verificationStrategy: 'STRATEGY' });
      await expect(setupService.getVerificationStrategy()).resolves.toBe('STRATEGY');
    });
  });
});

import { MockFactory } from '@douglasneuroinformatics/libnest/testing';
import type { MockedInstance } from '@douglasneuroinformatics/libnest/testing';
import { Test } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { SetupController } from '../setup.controller.js';
import { SetupService } from '../setup.service.js';

describe('SetupController', () => {
  let setupController: SetupController;
  let setupService: MockedInstance<SetupService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [SetupController],
      providers: [MockFactory.createForService(SetupService)]
    }).compile();
    setupController = moduleRef.get(SetupController);
    setupService = moduleRef.get(SetupService);
  });

  describe('getState', () => {
    it('should return the result from the SetupService', async () => {
      setupService.getState.mockResolvedValueOnce('SETUP_STATE');
      await expect(setupController.getState()).resolves.toBe('SETUP_STATE');
    });
  });

  describe('initApp', () => {
    it('should pass the arguments to, and return the result from, the SetupService', async () => {
      setupService.initApp.mockResolvedValueOnce('INIT_RESULT');
      const result = await setupController.initApp('INIT_ARG' as any);
      expect(setupService.initApp).toHaveBeenCalledExactlyOnceWith('INIT_ARG');
      expect(result).toBe('INIT_RESULT');
    });
  });
});

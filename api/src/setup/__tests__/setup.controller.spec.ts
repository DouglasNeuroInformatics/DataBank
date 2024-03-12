import { MockFactory } from '@douglasneuroinformatics/libnest/testing';
import { Test } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { SetupController } from '../setup.controller.js';
import { SetupService } from '../setup.service.js';

describe('SetupController', () => {
  let setupController: SetupController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [SetupController],
      providers: [MockFactory.createForService(SetupService)]
    }).compile();
    setupController = moduleRef.get(SetupController);
  });

  it('should be defined', () => {
    expect(setupController).toBeDefined();
  });
});

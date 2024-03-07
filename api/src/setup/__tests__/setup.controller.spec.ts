import { beforeEach, describe, expect, it } from 'bun:test';

import { createMock } from '@douglasneuroinformatics/nestjs/testing';
import { Test } from '@nestjs/testing';

import { SetupController } from '../setup.controller.js';
import { SetupService } from '../setup.service.js';

describe('SetupController', () => {
  let setupController: SetupController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [SetupController],
      providers: [
        {
          provide: SetupService,
          useValue: createMock(SetupService)
        }
      ]
    }).compile();
    setupController = moduleRef.get(SetupController);
  });

  it('should be defined', () => {
    expect(setupController).toBeDefined();
  });
});

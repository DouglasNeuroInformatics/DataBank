import assert from 'node:assert';
import { beforeEach, describe, it, mock } from 'node:test';

import { Test, TestingModule } from '@nestjs/testing';

import { DatasetsController } from '../datasets.controller.js';
import { DatasetsService } from '../datasets.service.js';

describe('DatasetsController', () => {
  let datasetsController: DatasetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DatasetsController],
      providers: [
        {
          provide: DatasetsService,
          useValue: mock.fn()
        }
      ]
    }).compile();

    datasetsController = module.get(DatasetsController);
  });

  it('should be defined', () => {
    assert(datasetsController);
  });
});

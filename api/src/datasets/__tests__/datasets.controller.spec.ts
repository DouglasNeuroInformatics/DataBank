import { beforeEach, describe, expect, it } from 'bun:test';

import { type MockedInstance, createMock } from '@douglasneuroinformatics/nestjs/testing';
import { Test } from '@nestjs/testing';

import { DatasetsController } from '../datasets.controller.js';
import { DatasetsService } from '../datasets.service.js';

describe('DatasetsController', () => {
  let datasetsController: DatasetsController;
  let datasetsService: MockedInstance<DatasetsService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [DatasetsController],
      providers: [
        {
          provide: DatasetsService,
          useValue: createMock(DatasetsService)
        }
      ]
    }).compile();
    datasetsController = moduleRef.get(DatasetsController);
    datasetsService = moduleRef.get(DatasetsService);
  });

  it('should be defined', () => {
    expect(datasetsController).toBeDefined();
    expect(datasetsService).toBeDefined();
  });
});

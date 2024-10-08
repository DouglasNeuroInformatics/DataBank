import { type MockedInstance, MockFactory } from '@douglasneuroinformatics/libnest/testing';
import { Test } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { DatasetsController } from '../datasets.controller.js';
import { DatasetsService } from '../datasets.service.js';

describe('DatasetsController', () => {
  let datasetsController: DatasetsController;
  let datasetsService: MockedInstance<DatasetsService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [DatasetsController],
      providers: [MockFactory.createForService(DatasetsService)]
    }).compile();
    datasetsController = moduleRef.get(DatasetsController);
    datasetsService = moduleRef.get(DatasetsService);
  });

  it('should be defined', () => {
    expect(datasetsController).toBeDefined();
    expect(datasetsService).toBeDefined();
  });
});

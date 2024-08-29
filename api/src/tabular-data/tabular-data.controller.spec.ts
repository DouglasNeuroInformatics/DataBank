import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { beforeEach } from 'vitest';

import { TabularDataController } from './tabular-data.controller';

describe('TabularDataController', () => {
  let controller: TabularDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TabularDataController]
    }).compile();

    controller = module.get<TabularDataController>(TabularDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

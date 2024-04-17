import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { TabularDataService } from './tabular-data.service';

describe('TabularDataService', () => {
  let service: TabularDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TabularDataService]
    }).compile();

    service = module.get<TabularDataService>(TabularDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

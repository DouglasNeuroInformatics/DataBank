import type { Model } from '@douglasneuroinformatics/libnest';
import { getModelToken } from '@douglasneuroinformatics/libnest';
import { MockFactory } from '@douglasneuroinformatics/libnest/testing';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { ColumnsService } from '@/columns/columns.service';

import { TabularDataService } from './tabular-data.service';

describe('TabularDataService', () => {
  let service: TabularDataService;
  let tabularDataModel: Model<'TabularData'>;
  let columnsService: ColumnsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TabularDataService,
        MockFactory.createForModelToken(getModelToken('TabularData')),
        MockFactory.createForService(ColumnsService)
      ]
    }).compile();

    tabularDataModel = module.get(getModelToken('TabularData'));
    columnsService = module.get(ColumnsService);
    service = module.get<TabularDataService>(TabularDataService);
  });

  it('should be defined', () => {
    expect(tabularDataModel).toBeDefined();
    expect(columnsService).toBeDefined();
    expect(service).toBeDefined();
  });
});

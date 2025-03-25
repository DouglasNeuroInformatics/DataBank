import { Module } from '@nestjs/common';

import { ColumnsModule } from '@/columns/columns.module.js';
import { TabularDataModule } from '@/tabular-data/tabular-data.module.js';
import { UsersModule } from '@/users/users.module.js';

import { DatasetsController } from './datasets.controller.js';
import { DatasetsService } from './datasets.service.js';

@Module({
  controllers: [DatasetsController],
  exports: [DatasetsService],
  imports: [UsersModule, ColumnsModule, TabularDataModule],
  providers: [DatasetsService]
})
export class DatasetsModule {}

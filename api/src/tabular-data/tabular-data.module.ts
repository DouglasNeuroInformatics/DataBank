import { Module } from '@nestjs/common';

import { ColumnsModule } from '@/columns/columns.module';

import { TabularDataService } from './tabular-data.service';

@Module({
  exports: [TabularDataService],
  imports: [ColumnsModule],
  providers: [TabularDataService]
})
export class TabularDataModule {}

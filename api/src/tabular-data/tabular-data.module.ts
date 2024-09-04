import { Module } from '@nestjs/common';

import { ColumnsModule } from '@/columns/columns.module';
import { PrismaModule } from '@/prisma/prisma.module';

import { TabularDataService } from './tabular-data.service';

@Module({
  exports: [TabularDataService],
  imports: [PrismaModule.forFeature('TabularData'), ColumnsModule],
  providers: [TabularDataService]
})
export class TabularDataModule {}

import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// import { DatasetsModule } from '@/datasets/datasets.module';
import { PrismaModule } from '@/prisma/prisma.module';
// import { TabularDataModule } from '@/tabular-data/tabular-data.module';

import { ColumnsService } from './columns.service';

@Module({
  exports: [ColumnsService],
  imports: [PrismaModule.forFeature('TabularColumn'), PrismaClient],
  providers: [ColumnsService]
})
export class ColumnsModule {}

import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// import { DatasetsModule } from '@/datasets/datasets.module';
import { PrismaModule } from '@/prisma/prisma.module';
// import { TabularDataModule } from '@/tabular-data/tabular-data.module';

import { ColumnsController } from './columns.controller';
import { ColumnsService } from './columns.service';

@Module({
  controllers: [ColumnsController],
  exports: [ColumnsService],
  imports: [
    PrismaModule.forFeature('TabularColumn'),
    PrismaClient
    // TabularDataModule,
    // DatasetsModule
  ],
  providers: [ColumnsService]
})
export class ColumnsModule {}

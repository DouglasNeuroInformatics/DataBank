import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { ColumnsModule } from '@/columns/columns.module.js';
import { PrismaModule } from '@/prisma/prisma.module';
import { TabularDataModule } from '@/tabular-data/tabular-data.module.js';
import { UsersModule } from '@/users/users.module.js';

import { DatasetsController } from './datasets.controller.js';
import { DatasetsService } from './datasets.service.js';

@Module({
  controllers: [DatasetsController],
  exports: [DatasetsService],
  imports: [PrismaModule.forFeature('Dataset'), PrismaClient, UsersModule, ColumnsModule, TabularDataModule],
  providers: [DatasetsService]
})
export class DatasetsModule {}

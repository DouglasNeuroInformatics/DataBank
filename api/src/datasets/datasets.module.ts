import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';

import { DatasetsController } from './datasets.controller.js';
import { DatasetsService } from './datasets.service.js';

@Module({
  controllers: [DatasetsController],
  exports: [DatasetsService],
  imports: [
    PrismaModule.forFeature('Dataset'),
    PrismaModule.forFeature('TabularColumn'),
    PrismaModule.forFeature('TabularData'),
    PrismaModule.forFeature('User')
  ],
  providers: [DatasetsService]
})
export class DatasetsModule {}

import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { ColumnsModule } from '@/columns/columns.module.js';
import { TabularDataModule } from '@/tabular-data/tabular-data.module.js';
import { UsersModule } from '@/users/users.module.js';

import { DatasetsController } from './datasets.controller.js';
import { DatasetsService } from './datasets.service.js';
import { FileUploadProcessor } from './file-upload.processor.js';

@Module({
  controllers: [DatasetsController],
  exports: [DatasetsService],
  imports: [
    UsersModule,
    ColumnsModule,
    TabularDataModule,
    BullModule.registerQueue({
      name: 'file-upload'
    })
  ],
  providers: [DatasetsService, FileUploadProcessor]
})
export class DatasetsModule {}

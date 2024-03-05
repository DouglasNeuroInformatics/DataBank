import { Module } from '@nestjs/common';

import { DatasetsController } from './datasets.controller.js';
import { DatasetsService } from './datasets.service.js';

@Module({
  controllers: [DatasetsController],
  exports: [DatasetsService],
  providers: [DatasetsService]
})
export class DatasetsModule {}

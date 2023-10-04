import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DatasetsController } from './datasets.controller.js';
import { DatasetsService } from './datasets.service.js';
import { Dataset, DatasetSchema } from './schemas/dataset.schema.js';

@Module({
  controllers: [DatasetsController],
  exports: [DatasetsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Dataset.name,
        schema: DatasetSchema
      }
    ])
  ],
  providers: [DatasetsService]
})
export class DatasetsModule {}

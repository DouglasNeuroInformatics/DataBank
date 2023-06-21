import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DatasetsController } from './datasets.controller.js';
import { DatasetsService } from './datasets.service.js';
import { Dataset, DatasetSchema } from './schemas/dataset.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Dataset.name,
        schema: DatasetSchema
      }
    ])
  ],
  controllers: [DatasetsController],
  providers: [DatasetsService]
})
export class DatasetsModule {}

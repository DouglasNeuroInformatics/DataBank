import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { CreateDatasetDto } from './dto/create-dataset.dto.js';
import { Dataset } from './schemas/dataset.schema.js';

@Injectable()
export class DatasetsService {
  constructor(@InjectModel(Dataset.name) private datasetModel: Model<Dataset>) {}

  createDataset(createDatasetDto: CreateDatasetDto) {
    return this.datasetModel.create(createDatasetDto);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CurrentUser, DatasetInfo } from '@databank/types';
import { Model } from 'mongoose';

import { CreateDatasetDto } from './dto/create-dataset.dto.js';
import { Dataset } from './schemas/dataset.schema.js';

@Injectable()
export class DatasetsService {
  constructor(@InjectModel(Dataset.name) private datasetModel: Model<Dataset>) {}

  createDataset(createDatasetDto: CreateDatasetDto, owner: CurrentUser) {
    return this.datasetModel.create({ ...createDatasetDto, owner });
  }

  getAvailable(ownerId?: string): Promise<DatasetInfo[]> {
    return this.datasetModel.find({ owner: ownerId }, '-data');
  }

  async getById(id: string): Promise<Dataset> {
    const dataset = await this.datasetModel.findById(id); //.populate('owner').lean();
    if (!dataset) {
      throw new NotFoundException();
    }
    await dataset.populate('owner');
    return dataset;
  }
}

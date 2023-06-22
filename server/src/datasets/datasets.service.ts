import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { DatasetInfo } from '@databank/types';
import { Model } from 'mongoose';

import { CreateDatasetDto } from './dto/create-dataset.dto.js';
import { Dataset } from './schemas/dataset.schema.js';

import { User } from '@/users/schemas/user.schema.js';

@Injectable()
export class DatasetsService {
  constructor(@InjectModel(Dataset.name) private datasetModel: Model<Dataset>) {}

  createDataset(createDatasetDto: CreateDatasetDto, owner: User) {
    return this.datasetModel.create({ ...createDatasetDto, owner });
  }

  getAvailable(): Promise<DatasetInfo[]> {
    return this.datasetModel.find({}, '-data');
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

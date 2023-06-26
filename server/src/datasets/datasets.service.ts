import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { DatasetInfo } from '@databank/types';
import { Model, ObjectId } from 'mongoose';

import { CreateDatasetDto } from './dto/create-dataset.dto.js';
import { Dataset } from './schemas/dataset.schema.js';
import { UpdateDatasetColumnDto } from './dto/dataset-column.dto.js';

@Injectable()
export class DatasetsService {
  constructor(@InjectModel(Dataset.name) private datasetModel: Model<Dataset>) {}

  createDataset(createDatasetDto: CreateDatasetDto, ownerId: ObjectId) {
    console.log(createDatasetDto, ownerId);
    return this.datasetModel.create({ ...createDatasetDto, owner: ownerId });
  }

  getAvailable(ownerId?: string | ObjectId): Promise<DatasetInfo[]> {
    return this.datasetModel.find({ owner: ownerId }, '-data');
  }

  async getById(id: string | ObjectId): Promise<Dataset> {
    const dataset = await this.datasetModel.findById(id);
    if (!dataset) {
      throw new NotFoundException();
    }
    await dataset.populate('owner');
    return dataset;
  }

  async updateColumn(dto: UpdateDatasetColumnDto, id: ObjectId, column?: string) {
    const dataset = await this.datasetModel.findById(id);
    if (!dataset) {
      throw new NotFoundException();
    }
    // Replace this crap and do it properly after first demo
    const index = dataset.columns.findIndex(({ name }) => name === column);
    if (index === -1) {
      throw new NotFoundException(`Cannot find column: ${column!}`);
    }
    dataset.columns[index] = Object.assign(dataset.columns[index], dto);
    await dataset.save();
    return dataset;
  }

  async deleteColumn(id: ObjectId, column?: string): Promise<Dataset> {
    const dataset = await this.datasetModel.findById(id);
    if (!dataset) {
      throw new NotFoundException();
    }
    // Replace this crap and do it properly after first demo
    const toRemove = dataset.columns.find(({ name }) => name === column);
    if (!toRemove) {
      throw new NotFoundException(`Cannot find column: ${column!}`);
    }
    dataset.columns = dataset.columns.filter(({ name }) => name !== column);
    for (const entry of dataset.data) {
      delete entry[column!];
    }
    await dataset.save();
    return dataset;
  }
}

import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { DatasetColumnType, DatasetEntry, DatasetInfo } from '@databank/types';
import { Model, ObjectId } from 'mongoose';

import { CreateDatasetDto } from './dto/create-dataset.dto.js';
import { UpdateDatasetColumnDto } from './dto/dataset-column.dto.js';
import { Dataset } from './schemas/dataset.schema.js';

@Injectable()
export class DatasetsService {
  constructor(@InjectModel(Dataset.name) private datasetModel: Model<Dataset>) {}

  async createDataset(createDatasetDto: CreateDatasetDto, ownerId: ObjectId) {
    if (await this.datasetModel.exists({ name: createDatasetDto.name })) {
      throw new ConflictException(`Dataset with name '${createDatasetDto.name}' 'already exists`)
    }
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

  async deleteDataset(id: ObjectId) {
    return this.datasetModel.findByIdAndDelete(id);
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

    if (dto.type) {
      dataset.data = this.mutateTypes(dataset.data, column!, dto.type);
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

  mutateColumn(data: DatasetEntry[], column: string, type: DatasetColumnType): DatasetEntry[] {
    for (let i = 0; i < data.length; i++) {
      const initialValue = data[i][column];
      if (type === 'FLOAT' || type === 'INTEGER') {
        const updatedValue = Number(initialValue);
        if (isNaN(updatedValue)) {
          throw new BadRequestException(`Cannot safely coerce '${initialValue}' to number`);
        } else if (type === 'INTEGER' && !Number.isInteger(updatedValue)) {
          throw new BadRequestException(`Value can be coerced to number, but it is not an integer: ${updatedValue}`);
        }
        data[i][column] = updatedValue;
      } else if (type === 'STRING') {
        data[i][column] = String(initialValue);
      }
    }
    return data;
  }
}

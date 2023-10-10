import type { DatasetColumnType, DatasetEntry, DatasetInfo } from '@databank/types';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, type ObjectId } from 'mongoose';

import { CreateDatasetDto } from './dto/create-dataset.dto';
import { UpdateDatasetColumnDto } from './dto/dataset-column.dto';
import { Dataset } from './schemas/dataset.schema';

@Injectable()
export class DatasetsService {
  constructor(@InjectModel(Dataset.name) private datasetModel: Model<Dataset>) {}

  createDataset(createDatasetDto: CreateDatasetDto, ownerId: ObjectId) {
    return this.datasetModel.create({ ...createDatasetDto, owner: ownerId });
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
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete entry[column!];
    }
    await dataset.save();
    return dataset;
  }

  async deleteDataset(id: ObjectId) {
    return this.datasetModel.findByIdAndDelete(id);
  }

  getAvailable(ownerId?: ObjectId | string): Promise<DatasetInfo[]> {
    return this.datasetModel.find({ owner: ownerId }, '-data');
  }

  async getById(id: ObjectId | string): Promise<Dataset> {
    const dataset = await this.datasetModel.findById(id);
    if (!dataset) {
      throw new NotFoundException();
    }
    await dataset.populate('owner');
    return dataset;
  }

  mutateTypes(data: DatasetEntry[], column: string, type: DatasetColumnType): DatasetEntry[] {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < data.length; i++) {
      const initialValue = data[i]![column];
      if (type === 'FLOAT' || type === 'INTEGER') {
        const updatedValue = Number(initialValue);
        if (isNaN(updatedValue)) {
          throw new BadRequestException(`Cannot safely coerce '${initialValue}' to number`);
        } else if (type === 'INTEGER' && !Number.isInteger(updatedValue)) {
          throw new BadRequestException(`Value can be coerced to number, but it is not an integer: ${updatedValue}`);
        }
        data[i]![column] = updatedValue;
        // could add more in the future
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      } else if (type === 'STRING') {
        data[i]![column] = String(initialValue);
      }
    }
    return data;
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

    dataset.columns[index] = Object.assign(dataset.columns[index]!, dto);
    await dataset.save();
    return dataset;
  }
}

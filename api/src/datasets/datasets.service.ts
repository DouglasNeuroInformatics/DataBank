import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ColumnType, type Dataset } from '@prisma/client';
import { Model } from 'mongoose';
import { pl } from 'nodejs-polars';

import { InjectModel } from '@/core/decorators/inject-prisma-client.decorator'; S


@Injectable()
export class DatasetsService {
  constructor(@InjectModel('Dataset') private datasetModel: Model<Dataset>) { }

  create(createDatasetDto: CreateDatasetDto, ownerId: string) {
    return this.datasetModel.create({ ...createDatasetDto, owner: ownerId });
  }

  async deleteById(id: string) {
    return this.datasetModel.findByIdAndDelete(id);
  }

  async deleteColumn(id: string, column?: string): Promise<Dataset> {
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

  getAvailable(ownerId?: string) {
    return this.datasetModel.find({ owner: ownerId }, '-data');
  }

  async getById(id: string): Promise<Dataset> {
    const dataset = await this.datasetModel.findById(id);
    if (!dataset) {
      throw new NotFoundException();
    }
    await dataset.populate('owner');
    return dataset;
  }

  // getAvailableMetadata() { }

  // getMetadataById() { }

  mutateTypes(data: DatasetEntry[], column: string, type: ColumnType): DatasetEntry[] {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < data.length; i++) {
      const initialValue = data[i]![column];
      if (type === ColumnType.FLOAT_COLUMN || type === ColumnType.INT_COLUMN) {
        const updatedValue = Number(initialValue);
        if (isNaN(updatedValue)) {
          throw new BadRequestException(`Cannot safely coerce '${initialValue}' to number`);
        } else if (type === ColumnType.INT_COLUMN && !Number.isInteger(updatedValue)) {
          throw new BadRequestException(`Value can be coerced to number, but it is not an integer: ${updatedValue}`);
        }
        data[i]![column] = updatedValue;
        // could add more in the future
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      } else if (ColumnType.STRING_COLUMN) {
        data[i]![column] = String(initialValue);
      }
    }
    return data;
  }

  async updateColumn(dto: UpdateDatasetColumnDto, id: string, column?: string) {
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

  // private validateDataset() {
  //   return 'to-do'
  // }

  // private updateSummary() {
  //   return 'to-do'
  // }

  // removeManager(datasetId, managerId, managerIdToRemove) {
  //   if (user is not in manager[]) {
  //     throw new ForbiddenException();
  //   }
  // }

  // addManager(datasetId, managerId, managerIdToRemove) {
  //   if (user is not in manager[]) {
  //     throw new ForbiddenException();
  //   }
  // }
}

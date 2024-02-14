import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ColumnType, type Dataset, PrismaClient, type TabularData } from '@prisma/client';
import { pl } from 'nodejs-polars';
import { inferSchema, initParser } from 'udsv';

import { InjectModel, InjectPrismaClient } from '@/core/decorators/inject-prisma-client.decorator';
import type { Model } from '@/prisma/prisma.types';

import type { CreateDatasetDto, TabularColumn } from './zod/dataset';



@Injectable()
export class DatasetsService {
  constructor(@InjectModel('Dataset') private datasetModel: Model<"Dataset">,
    @InjectModel('TabularColumn') private columnModel: Model<'TabularColumn'>,
    @InjectModel('TabularData') private tabularDataModel: Model<'TabularData'>,
    @InjectPrismaClient() private prisma: PrismaClient) { }

  async createDataset(createDatasetDto: CreateDatasetDto, file: Express.Multer.File, managerId: string) {
    // file received through the network is stored in memory buffer which can be converted to string without any problem
    const csvString = file.buffer.toString();

    // udsv provided methods to infer the schema from the csv string
    let schema = inferSchema(csvString);
    // construct the parser according to the schema
    let parser = initParser(schema);
    // the parser takes the string and return the desire type of processed object
    let typedObjs = parser.typedObjs(csvString);

    // the above code return an object of records so that nodejs polars can use as an input and construct the dataframe
    // choosing polars because we want fast computation of column summaries
    const df = pl.readRecords(typedObjs);
    // TO DO: make the real data structure for storage in the database

    const dataset = await this.datasetModel.create({
      data: {
        name: createDatasetDto.name,
        managerIds: createDatasetDto.managerIDs,
        description: createDatasetDto.description,

      }
    })

    const tabularData = await this.tabularDataModel.create({
    });

    await this.columnModel.create({
      columnType: 'STRING_COLUMN',
      dataPermission: 'MANAGER',
      name: 'from df',
      nullable: false,
      stringData: ["lslslslsls"],
      summaryPermission: "MANAGER",
      tabularDataId: 'from previously created tabulardata return'
    })



  }

  async deleteColumn(columnId: string, currentUserId: string): Promise<Dataset> {
    const column = await this.columnModel.findById(columnId);
    if (!column) {
      throw new NotFoundException();
    }
    const tabularData = await this.tabularDataModel.findById(column.tabularDataId)
    if (!tabularData) {
      throw new NotFoundException();
    }
    const dataset = await this.datasetModel.findById(tabularData.datasetId)
    if (!dataset) {
      throw new NotFoundException();
    }
    if (!(currentUserId in dataset.managerIds)) {
      throw new ForbiddenException('Only managers can modify this dataset!');
    }
    await column.deleteOne();
    return dataset;
  }

  async deleteDataset(datasetId: string, currentUserId: string) {
    const dataset = await this.datasetModel.findById(datasetId);
    if (!dataset) {
      throw new NotFoundException('The dataset to be deleted is not found!');
    }

    if (!(currentUserId in dataset.managerIds)) {
      throw new ForbiddenException('Only managers can modify this dataset!');
    }

    return await dataset.deleteOne();
  }

  getAvailable(ownerId?: string) {
    return this.datasetModel.find({ owner: ownerId }, '-data');
  }

  async getById(datasetId: string, currentUserIduserId: string): Promise<Dataset> {
    const dataset = await this.datasetModel.findById(datasetId);
    if (!dataset) {
      throw new NotFoundException();
    }
    if (dataset.datasetType == "TABULAR") {
      const tabularData: TabularData = dataset.tabularData;
      console.log(tabularData)
    }
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

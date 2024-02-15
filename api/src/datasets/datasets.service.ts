import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ColumnType, type Dataset, PrismaClient, type TabularData } from '@prisma/client';
import { pl } from 'nodejs-polars';

import { InjectModel, InjectPrismaClient } from '@/core/decorators/inject-prisma-client.decorator';
import type { Model } from '@/prisma/prisma.types';

import type { CreateTabularDatasetDto } from './zod/dataset';



@Injectable()
export class DatasetsService {
  constructor(
    @InjectModel('Dataset') private datasetModel: Model<"Dataset">,
    @InjectModel('TabularColumn') private columnModel: Model<'TabularColumn'>,
    @InjectModel('TabularData') private tabularDataModel: Model<'TabularData'>,
    // the below line will be use for transactions later
    // @InjectPrismaClient() private prisma: PrismaClient
  ) { }

  async createDataset(createTabularDatasetDto: CreateTabularDatasetDto, file: Express.Multer.File, managerId: string) {
    // file received through the network is stored in memory buffer which is converted to a string
    const csvString = file.buffer.toString().replaceAll('\t', ',');  // polars has a bug parsing tsv, this is a hack for it to work
    const df = pl.readCSV(csvString, { tryParseDates: true });
    // TO DO: make the real data structure for storage in the database

    const dataset = await this.datasetModel.create({
      data: {
        datasetType: 'TABULAR',
        description: createTabularDatasetDto.description,
        managerIds: [managerId],
        name: createTabularDatasetDto.name
      }
    })

    const tabularData = await this.tabularDataModel.create({
      data: {
        datasetId: dataset.id,
        primaryKeys: createTabularDatasetDto.primaryKeys
      }
    });


    for (let col of df.getColumns()) {
      // create a float column
      if (col.isFloat()) {
        await this.columnModel.create({
          data: {
            dataPermission: "MANAGER",
            floatData: col.toArray(),
            name: col.name,
            nullable: col.nullCount() != 0,
            numericColumnValidation: {
              max: col.max(),
              min: col.min()
            },
            summary: {
              count: col.len(),
              floatSummary: {
                max: col.max(),
                mean: col.mean(),
                median: col.median(),
                min: col.min(),
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                std: col.rollingStd(col.len())[-1]
              },
              notNullCount: col.len() - col.nullCount()
            },
            summaryPermission: "MANAGER",
            tabularDataId: tabularData.id,
            type: "FLOAT_COLUMN"
          }
        });
        continue;
      }

      // create an int column
      if (col.isNumeric()) {
        await this.columnModel.create({
          data: {
            dataPermission: "MANAGER",
            intData: col.toArray(),
            name: col.name,
            nullable: col.nullCount() != 0,
            numericColumnValidation: {
              max: col.max(),
              min: col.min()
            },
            summary: {
              count: col.len(),
              intSummary: {
                max: col.max(),
                mean: col.mean(),
                median: col.median(),
                min: col.min(),
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                mode: col.mode()[0],
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                std: col.rollingStd(col.len())[-1]
              },
              notNullCount: col.len() - col.nullCount()
            },
            summaryPermission: "MANAGER",
            tabularDataId: tabularData.id,
            type: 'INT_COLUMN'
          }
        });
        continue;
      }

      // create a boolean column
      if (col.isBoolean()) {
        await this.columnModel.create({
          data: {
            booleanData: col.toArray(),
            dataPermission: "MANAGER",
            name: col.name,
            nullable: col.nullCount() != 0,
            summary: {
              count: col.len(),
              // valueCounts() function always return null.
              // issue opened on nodejs-polars github
              // enumSummary: {
              //   distribution: col.valueCounts().toJSON()
              // },
              notNullCount: col.len() - col.nullCount()
            },
            summaryPermission: "MANAGER",
            tabularDataId: tabularData.id,
            type: 'BOOLEAN_COLUMN'
          }
        });
        continue;
      }

      // create a boolean column
      if (col.isDateTime()) {
        await this.columnModel.create({
          data: {
            dataPermission: "MANAGER",
            // date is represented as time difference from 1970-Jan-01
            // datetime is represented as milliseconds from 1970-Jan-01 00:00:00
            datatimeData: col.toArray(),
            datetimeColumnValidation: {
              max: new Date(),
              min: "1970-01-01",
              passISO: true
            },
            name: col.name,
            nullable: col.nullCount() != 0,
            summary: {
              count: col.len(),
              datetimeSummary: {
                max: new Date(),
                min: "1970-01-01"
              },
              notNullCount: col.len() - col.nullCount()
            },
            summaryPermission: "MANAGER",
            tabularDataId: tabularData.id,
            type: "DATETIME_COLUMN"
          }
        });
        continue;
      }

      // create a string column
      await this.columnModel.create({
        data: {
          dataPermission: "MANAGER",
          name: col.name,
          nullable: col.nullCount() != 0,
          stringColumnValidation: {
            min: 0,
          },
          stringData: col.toArray(),
          summary: {
            count: col.len(),
            notNullCount: col.len() - col.nullCount()
          },
          summaryPermission: "MANAGER",
          tabularDataId: tabularData.id,
          type: "STRING_COLUMN"
        }
      });
    }

    return dataset;
  }

  async deleteColumn(columnId: string, currentUserId: string): Promise<Dataset> {
    const column = await this.columnModel.findUnique({
      where: {
        id: columnId
      }
    })
    if (!column) {
      throw new NotFoundException();
    }

    const tabularData = await this.tabularDataModel.findUnique({
      where: {
        id: column.tabularDataId
      }
    });
    if (!tabularData) {
      throw new NotFoundException();
    }

    const dataset = await this.datasetModel.findUnique({
      where: {
        id: tabularData.datasetId
      }
    });
    if (!dataset) {
      throw new NotFoundException();
    }
    if (!(currentUserId in dataset.managerIds)) {
      throw new ForbiddenException('Only managers can modify this dataset!');
    }
    await this.columnModel.delete({
      where: {
        id: columnId
      }
    })

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

  getAvailable() {
    return;
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

  // private primaryKeyCheck(primaryKeys: string[], df: pl.DataFrame) {
  //   for (let key of primaryKeys) {
  //     if (df[key].nullCount() > 0) {
  //       console.log(df[key].nullCount())
  //       return false
  //     }
  //   }
  //   const checkPrimaryKeysArray = df.select(...primaryKeys).isUnique().toArray();
  //   return checkPrimaryKeysArray.reduce((prev, curr) => prev && curr);
  // }
}

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { PermissionLevel } from '@prisma/client';
import { type DataFrame, pl } from 'nodejs-polars';

import type { ColumnsService } from '@/columns/columns.service';
import { InjectModel } from '@/core/decorators/inject-prisma-client.decorator';
import type { Model } from '@/prisma/prisma.types';

import type { GetTabularDataViewDto, UpdatePrimaryKeysDto } from './zod/tabular-data';

@Injectable()
export class TabularDataService {
  constructor(
    @InjectModel('TabularData') private readonly tabularDataModel: Model<'TabularData'>,
    private readonly columnsService: ColumnsService
  ) {}

  async changeTabularColumnsMetadataPermission(
    datasetId: string,
    currentUserId: string,
    permissionLevel: PermissionLevel
  ) {
    const tabularData = await this.tabularDataModel.findUnique({
      include: {
        columns: true
      },
      where: {
        datasetId
      }
    });
    if (!tabularData) {
      throw new NotFoundException(`Cannot find tabular with dataset id ${datasetId}`);
    }

    for (let col of tabularData.columns) {
      await this.columnsService.changeColumnMetadataPermission(col.id, currentUserId, permissionLevel);
    }

    return tabularData;
  }

  // create tabular dataset
  async create(df: DataFrame, datasetId: string, primaryKeys: string[]) {
    const tabularData = await this.tabularDataModel.create({
      data: {
        datasetId,
        primaryKeys
      }
    });

    // for datasets without primary keys, generate a sequential id column
    if (primaryKeys.length === 0) {
      const indexArray = [];
      for (let i = 0; i < df.shape.height; i++) {
        indexArray.push(i);
      }
      const indexSeries = pl.Series('id', indexArray);
      df.insertAtIdx(0, indexSeries);
      primaryKeys.push('id');
    }

    if (!this.primaryKeyCheck(primaryKeys, df)) {
      throw new ForbiddenException('Dataset failed primary keys check!');
    }

    for (let col of df.getColumns()) {
      // create a float column
      if (col.isFloat()) {
        await this.columnsService.create({
          dataPermission: 'MANAGER',
          floatData: col.toArray(),
          kind: 'FLOAT',
          name: col.name,
          nullable: col.nullCount() != 0,
          // numericColumnValidation: {
          //   max: col.max(),
          //   min: col.min()
          // },
          summary: {
            count: col.len(),
            max: col.max(),
            mean: col.mean(),
            median: col.median(),
            min: col.min(),
            notNullCount: col.len() - col.nullCount(),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            std: col.rollingStd(col.len())[-1]
          },
          summaryPermission: 'MANAGER',
          tabularDataId: tabularData.id
        });
        continue;
      }

      // create an int column
      if (col.isNumeric()) {
        await this.columnsService.create({
          dataPermission: 'MANAGER',
          intData: col.toArray(),
          kind: 'INT',
          name: col.name,
          // numericColumnValidation: {
          //   max: col.max(),
          //   min: col.min()
          nullable: col.nullCount() != 0,
          // },
          summary: {
            count: col.len(),
            max: col.max(),
            mean: col.mean(),
            median: col.median(),
            min: col.min(),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            mode: col.mode()[0],
            notNullCount: col.len() - col.nullCount(),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            std: col.rollingStd(col.len())[-1]
          },
          summaryPermission: 'MANAGER',
          tabularDataId: tabularData.id
        });
        continue;
      }

      // create a boolean column
      if (col.isBoolean()) {
        await this.columnsService.create({
          dataPermission: 'MANAGER',
          enumData: col.toArray(),
          kind: 'ENUM',
          name: col.name,
          nullable: col.nullCount() != 0,
          summary: {
            count: col.len(),
            // distribute needs to be a record of string: number
            distribution: {},
            // col.valueCounts() returns a dataframe,
            notNullCount: col.len() - col.nullCount()
          },
          summaryPermission: 'MANAGER',
          tabularDataId: tabularData.id
        });
        continue;
      }

      // create a datetime column
      if (col.isDateTime()) {
        await this.columnsService.create({
          dataPermission: 'MANAGER',
          // date is represented as time difference from 1970-Jan-01
          // datetimeColumnValidation: {
          //   max: new Date(),
          //   min: '1970-01-01'
          // },
          // datetime is represented as milliseconds from 1970-Jan-01 00:00:00
          datetimeData: col.toArray(),
          kind: 'DATETIME',
          name: col.name,
          nullable: col.nullCount() != 0,
          summary: {
            count: col.len(),
            max: new Date(),
            min: new Date('1970-01-01'),
            notNullCount: col.len() - col.nullCount()
          },
          summaryPermission: 'MANAGER',
          tabularDataId: tabularData.id
        });
        continue;
      }

      // create a string column
      await this.columnsService.create({
        dataPermission: 'MANAGER',
        kind: 'STRING',
        name: col.name,
        // stringColumnValidation: {
        //   minLength: 0
        nullable: col.nullCount() != 0,
        // },
        stringData: col.toArray(),
        summary: {
          count: col.len(),
          notNullCount: col.len() - col.nullCount()
        },
        summaryPermission: 'MANAGER',
        tabularDataId: tabularData.id
      });
    }

    return tabularData;
  }
  // delete tabular dataset
  deleteById(tabularDataId: string) {
    return this.tabularDataModel.delete({
      where: {
        id: tabularDataId
      }
    });
  }
  async findById(tabularDataId: string) {
    const tabularData = await this.tabularDataModel.findUnique({
      where: {
        id: tabularDataId
      }
    });

    if (!tabularData) {
      throw new NotFoundException('Cannot find tabular data!');
    }

    return tabularData;
  }
  // getTabularDataView
  async getViewById(getTabularDataViewDto: GetTabularDataViewDto) {
    // get view dto should contain a list of columns
    const tabularData = await this.tabularDataModel.findUnique({
      include: {
        columns: {
          where: {
            id: { in: getTabularDataViewDto.columnIds }
          }
        }
      },
      where: {
        id: getTabularDataViewDto.tabularDataId
      }
    });

    if (!tabularData) {
      throw new NotFoundException(`Cannot find tabular data with id ${getTabularDataViewDto.tabularDataId}`);
    }
  }

  // update Primary keys for a tabular column
  async updatePrimaryKeys(tabularDataId: string, updatePrimaryKeysDto: UpdatePrimaryKeysDto) {
    return await this.tabularDataModel.update({
      data: updatePrimaryKeysDto,
      where: {
        id: tabularDataId
      }
    });
  }

  private primaryKeyCheck(primaryKeys: string[], df: DataFrame): boolean {
    for (let key of primaryKeys) {
      const col = df.getColumn(key);
      if (col.nullCount() > 0) {
        return false;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const checkPrimaryKeysArray: boolean[] = df
      .select(...primaryKeys)
      .isUnique()
      .toArray();
    return checkPrimaryKeysArray.reduce((prev, curr) => prev && curr);
  }
}

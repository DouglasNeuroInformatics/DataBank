/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { ColumnSummary, DatasetViewPaginationDto, TabularDatasetView } from '@databank/types';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { PermissionLevel, TabularColumn } from '@prisma/client';

import { ColumnsService } from '@/columns/columns.service';
import { InjectModel } from '@/core/decorators/inject-prisma-client.decorator';
import type { Model } from '@/prisma/prisma.types';
import type { GetColumnViewDto, ProjectDatasetDto } from '@/projects/zod/projects';
import { type DataFrame, pl } from '@/vendor/nodejs-polars.js';

import type { UpdatePrimaryKeysDto } from './zod/tabular-data';

@Injectable()
export class TabularDataService {
  constructor(
    @InjectModel('TabularData') private readonly tabularDataModel: Model<'TabularData'>,
    private readonly columnsService: ColumnsService
  ) {}

  async changeTabularColumnsMetadataPermission(datasetId: string, permissionLevel: PermissionLevel) {
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
      await this.columnsService.changeColumnMetadataPermission(col.id, permissionLevel);
    }

    return tabularData;
  }

  // create tabular dataset
  async create(df: DataFrame, datasetId: string, primaryKeys: string[]) {
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

    const tabularData = await this.tabularDataModel.create({
      data: {
        datasetId,
        primaryKeys
      }
    });

    for (let col of df.getColumns()) {
      await this.columnsService.createFromSeries(tabularData.id, col);
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

  async getProjectViewById(projectDatasetDto: ProjectDatasetDto) {
    const columnIds: string[] = [];
    const columnsView: TabularColumn[] = [];
    for (let col of projectDatasetDto.columns) {
      columnIds.push(col.columnId);
      const getColumnViewDto: GetColumnViewDto = {
        ...col,
        rowMax: projectDatasetDto.rowFilter ? projectDatasetDto.rowFilter.rowMax : null,
        rowMin: projectDatasetDto.rowFilter ? projectDatasetDto.rowFilter.rowMin : 0
      };
      const currColumnView = await this.columnsService.getColumnView(getColumnViewDto);
      // 2. need to handle column type filter HANDLE HERE, throw an error if there is a conflict between the column ID and the type filter
      if (!projectDatasetDto.useDataTypeFilter || currColumnView.kind in projectDatasetDto.dataTypeFilters) {
        columnsView.push(currColumnView);
      }
    }

    const tabularData = await this.tabularDataModel.findUnique({
      include: {
        columns: {
          where: {
            id: { in: columnIds }
          }
        }
      },
      where: {
        datasetId: projectDatasetDto.datasetId
      }
    });

    if (!tabularData) {
      throw new NotFoundException(`Cannot find tabular data with id ${projectDatasetDto.datasetId}`);
    }

    tabularData.columns = columnsView;

    return tabularData;
  }

  async getViewById(tabularDataId: string, datasetViewPaginationDto: DatasetViewPaginationDto) {
    const tabularData = await this.tabularDataModel.findUnique({
      include: {
        columns: true
      },
      where: {
        id: tabularDataId
      }
    });

    if (!tabularData) {
      throw new NotFoundException('No tabular data found!');
    }

    let columnIds: string[] = [];
    let columns: string[] = [];

    let rows: { [key: string]: boolean | null | number | string }[] = [];
    if (!tabularData.columns[0]?.id) {
      throw new NotFoundException('No columns in this tabular data.');
    }
    const numberOfRows = await this.columnsService.getLengthById(tabularData.columns[0]?.id);
    for (let i = 0; i < numberOfRows; i++) {
      rows.push({});
    }

    let metaData: { [key: string]: ColumnSummary } = {};

    // handle pagination here: TODO
    datasetViewPaginationDto.columnsPerPage;

    for (let col of tabularData.columns) {
      columnIds.push(col.id);
      columns.push(col.name);

      switch (col.kind) {
        case 'STRING':
          col.stringData.map((entry, i) => {
            if (!rows[i]) {
              rows[i] = {};
            }
            rows[i][col.name] = entry.value;
          });
          metaData[col.name] = {
            kind: 'STRING',
            ...col.summary
          };
          break;
        case 'BOOLEAN':
          col.booleanData.map((entry, i) => {
            if (!rows[i]) {
              rows[i] = {};
            }
            rows[i][col.name] = entry.value;
          });
          metaData[col.name] = {
            count: col.summary.count,
            kind: 'BOOLEAN',
            nullCount: col.summary.nullCount,
            trueCount: col.summary.count
          };
          break;
        case 'INT':
          col.intData.map((entry, i) => {
            if (!rows[i]) {
              rows[i] = {};
            }
            rows[i][col.name] = entry.value;
          });
          metaData[col.name] = {
            count: col.summary.count,
            kind: 'INT',
            nullCount: col.summary.nullCount,
            ...col.summary.intSummary
          };
          break;
        case 'FLOAT':
          col.floatData.map((entry, i) => {
            if (!rows[i]) {
              rows[i] = {};
            }
            rows[i][col.name] = entry.value;
          });
          metaData[col.name] = {
            count: col.summary.count,
            kind: 'FLOAT',
            nullCount: col.summary.nullCount,
            ...col.summary.floatSummary
          };
          break;
        case 'ENUM':
          col.enumData.map((entry, i) => {
            if (!rows[i]) {
              rows[i] = {};
            }
            rows[i][col.name] = entry.value;
          });
          metaData[col.name] = {
            count: col.summary.count,
            kind: 'ENUM',
            nullCount: col.summary.nullCount
          };
          break;
        case 'DATETIME':
          col.datetimeData.map((entry, i) => {
            if (!rows[i]) {
              rows[i] = {};
            }
            rows[i][col.name] = entry.value?.toDateString() ?? null;
          });
          metaData[col.name] = {
            kind: 'STRING',
            ...col.summary
          };
          break;
      }
    }

    const dataView: TabularDatasetView = {
      columnIds,
      columns,
      metadata: metaData,
      primaryKeys: tabularData.primaryKeys,
      rows
    };

    return dataView;
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

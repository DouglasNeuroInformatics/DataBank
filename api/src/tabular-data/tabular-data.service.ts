/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type {
  ColumnSummary,
  DatasetViewPaginationDto,
  ProjectDatasetDto,
  ProjectTabularDatasetView,
  TabularDatasetView
} from '@databank/types';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { PermissionLevel } from '@prisma/client';

import { ColumnsService } from '@/columns/columns.service';
import { InjectModel } from '@/core/decorators/inject-prisma-client.decorator';
import type { Model } from '@/prisma/prisma.types';
import type { GetColumnViewDto } from '@/projects/zod/projects';
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

    try {
      for (let col of df.getColumns()) {
        await this.columnsService.createFromSeries(tabularData.id, col);
      }
    } catch {
      await this.columnsService.deleteByTabularDataId(tabularData.id);
      await this.tabularDataModel.delete({
        where: {
          id: tabularData.id
        }
      });
      throw new ForbiddenException('Cannot create Tabular Dataset!');
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

  async deleteColumnById(tabularDataId: string, columnId: string) {
    await this.tabularDataModel.findUnique({
      where: {
        id: tabularDataId
      }
    });

    // need logic here to handle primary key deletion

    return this.columnsService.deleteById(columnId);
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

  async getProjectDatasetView(
    projectDatasetDto: ProjectDatasetDto,
    rowPagination: DatasetViewPaginationDto,
    columnPagination: DatasetViewPaginationDto
  ) {
    const columnIds: { [key: string]: string } = {};
    const columns: string[] = [];
    const metaData: { [key: string]: any } = {};
    const rows: { [key: string]: boolean | number | string }[] = [];

    const rowStart = (rowPagination.currentPage - 1) * rowPagination.itemsPerPage;
    const rowEnd = rowPagination.currentPage * rowPagination.itemsPerPage;
    const columnStart = (columnPagination.currentPage - 1) * columnPagination.itemsPerPage;
    const columnEnd = columnPagination.currentPage * columnPagination.itemsPerPage;

    for (let col of projectDatasetDto.columns.slice(columnStart, columnEnd)) {
      const getColumnViewDto: GetColumnViewDto = {
        ...col,
        rowMax: projectDatasetDto.rowFilter ? projectDatasetDto.rowFilter.rowMax : null,
        rowMin: projectDatasetDto.rowFilter ? projectDatasetDto.rowFilter.rowMin : 0
      };
      const currColumnView = await this.columnsService.getColumnView(getColumnViewDto);
      columns.push(currColumnView.name);
      columnIds[currColumnView.name] = currColumnView.id;
      metaData[currColumnView.name] = {
        count: currColumnView.count,
        kind: currColumnView.kind,
        max: currColumnView.max,
        mean: currColumnView.mean,
        median: currColumnView.median,
        min: currColumnView.min,
        mode: currColumnView.mode,
        nullable: currColumnView.nullable,
        nullCount: currColumnView.nullCount,
        std: currColumnView.std
      };

      switch (currColumnView.kind) {
        case 'STRING':
          currColumnView.stringData.map((entry, i) => {
            if (!rows[i]) {
              rows[i] = {};
            }
            rows[i][currColumnView.name] = entry.value!;
          });
          break;
        case 'BOOLEAN':
          currColumnView.booleanData.map((entry, i) => {
            if (!rows[i]) {
              rows[i] = {};
            }
            rows[i][currColumnView.name] = entry.value!;
          });
          break;
        case 'INT':
          currColumnView.intData.map((entry, i) => {
            if (!rows[i]) {
              rows[i] = {};
            }
            rows[i][currColumnView.name] = entry.value!;
          });
          break;
        case 'FLOAT':
          currColumnView.floatData.map((entry, i) => {
            if (!rows[i]) {
              rows[i] = {};
            }
            rows[i][currColumnView.name] = entry.value!;
          });
          break;
        case 'ENUM':
          currColumnView.enumData.map((entry, i) => {
            if (!rows[i]) {
              rows[i] = {};
            }
            rows[i][currColumnView.name] = entry.value!;
          });
          break;
        case 'DATETIME':
          currColumnView.datetimeData.map((entry, i) => {
            if (!rows[i]) {
              rows[i] = {};
            }
            rows[i][currColumnView.name] = entry.value!.toDateString()!;
          });
          break;
      }
    }

    const dataView: ProjectTabularDatasetView = {
      columnIds,
      columns,
      metadata: metaData,
      rows: rows.slice(rowStart, rowEnd),
      totalNumberOfColumns: projectDatasetDto.columns.length,
      totalNumberOfRows: rows.length
    };
    return dataView;
  }

  async getViewById(
    tabularDataId: string,
    userStatus: PermissionLevel,
    rowPagination: DatasetViewPaginationDto,
    columnPagination: DatasetViewPaginationDto
  ) {
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

    const columnIdsModifyData: string[] = [];
    const columnIdsModifyMetadata: string[] = [];

    if (userStatus === 'VERIFIED') {
      tabularData.columns.forEach((col) => {
        if (col.dataPermission === 'MANAGER') {
          columnIdsModifyData.push(col.id);
        }
        if (col.summaryPermission === 'MANAGER') {
          columnIdsModifyMetadata.push(col.id);
        }
      });
    } else if (userStatus === 'LOGIN') {
      tabularData.columns.forEach((col) => {
        if (col.dataPermission === 'MANAGER' || col.dataPermission === 'VERIFIED') {
          columnIdsModifyData.push(col.id);
        }
        if (col.summaryPermission === 'MANAGER' || col.dataPermission === 'VERIFIED') {
          columnIdsModifyMetadata.push(col.id);
        }
      });
    } else if (userStatus === 'PUBLIC') {
      tabularData.columns.forEach((col) => {
        if (col.dataPermission === 'MANAGER' || col.dataPermission === 'LOGIN' || col.dataPermission === 'VERIFIED') {
          columnIdsModifyData.push(col.id);
        }
        if (
          col.summaryPermission === 'MANAGER' ||
          col.summaryPermission === 'VERIFIED' ||
          col.summaryPermission === 'LOGIN'
        ) {
          columnIdsModifyMetadata.push(col.id);
        }
      });
    }

    let columnIds: { [key: string]: string } = {};
    let columns: string[] = [];

    let rows: { [key: string]: boolean | null | number | string }[] = [];
    if (!tabularData.columns[0]?.id) {
      throw new NotFoundException('No columns in this tabular data.');
    }

    const rowStart = (rowPagination.currentPage - 1) * rowPagination.itemsPerPage;
    const rowEnd = rowPagination.currentPage * rowPagination.itemsPerPage;
    const numberOfRows = await this.columnsService.getLengthById(tabularData.columns[0]?.id);
    const columnStart = (columnPagination.currentPage - 1) * columnPagination.itemsPerPage;
    const columnEnd = columnPagination.currentPage * columnPagination.itemsPerPage;

    for (let i = rowStart; i < rowEnd; i++) {
      rows.push({});
    }

    let metaData: { [key: string]: ColumnSummary } = {};

    for (let col of tabularData.columns.slice(columnStart, columnEnd)) {
      columnIds[col.name] = col.id;
      columns.push(col.name);

      switch (col.kind) {
        case 'STRING':
          col.stringData.slice(rowStart, rowEnd).map((entry, i) => {
            if (!rows[i]) {
              rows[i] = {};
            }

            if (columnIdsModifyData.includes(col.id)) {
              rows[i][col.name] = 'Hidden';
            } else {
              rows[i][col.name] = entry.value;
            }
          });

          if (columnIdsModifyMetadata.includes(col.id)) {
            metaData[col.name] = {
              count: 0,
              kind: 'STRING',
              nullCount: 0
            };
          } else {
            metaData[col.name] = {
              count: col.summary.count,
              kind: 'STRING',
              nullCount: col.summary.nullCount
            };
          }
          break;
        case 'BOOLEAN':
          col.booleanData.slice(rowStart, rowEnd).map((entry, i) => {
            if (!rows[i]) {
              rows[i] = {};
            }
            if (columnIdsModifyData.includes(col.id)) {
              rows[i][col.name] = 'Hidden';
            } else {
              rows[i][col.name] = entry.value;
            }
          });

          if (columnIdsModifyMetadata.includes(col.id)) {
            metaData[col.name] = {
              count: 0,
              kind: 'BOOLEAN',
              nullCount: 0,
              trueCount: 0
            };
          } else {
            metaData[col.name] = {
              count: col.summary.count,
              kind: 'BOOLEAN',
              nullCount: col.summary.nullCount,
              // BUG: trueCount doesn't work
              // trueCount: col.summary.enumSummary?.distribution
              trueCount: 0
            };
          }
          break;
        case 'INT':
          col.intData.slice(rowStart, rowEnd).map((entry, i) => {
            if (!rows[i]) {
              rows[i] = {};
            }
            if (columnIdsModifyData.includes(col.id)) {
              rows[i][col.name] = 'Hidden';
            } else {
              rows[i][col.name] = entry.value;
            }
          });
          if (columnIdsModifyMetadata.includes(col.id)) {
            metaData[col.name] = {
              count: 0,
              kind: 'INT',
              max: 0,
              mean: 0,
              median: 0,
              min: 0,
              mode: 0,
              nullCount: 0,
              std: 0
            };
          } else {
            metaData[col.name] = {
              count: col.summary.count,
              kind: 'INT',
              max: col.summary.intSummary?.max,
              mean: col.summary.intSummary?.mean,
              median: col.summary.intSummary?.median,
              min: col.summary.intSummary?.min,
              mode: col.summary.intSummary?.mode,
              nullCount: col.summary.nullCount,
              std: col.summary.intSummary?.std
            };
          }
          break;
        case 'FLOAT':
          col.floatData.slice(rowStart, rowEnd).map((entry, i) => {
            if (!rows[i]) {
              rows[i] = {};
            }
            if (columnIdsModifyData.includes(col.id)) {
              rows[i][col.name] = 'Hidden';
            } else {
              rows[i][col.name] = entry.value;
            }
          });

          if (columnIdsModifyMetadata.includes(col.id)) {
            metaData[col.name] = {
              count: 0,
              kind: 'FLOAT',
              max: 0,
              mean: 0,
              median: 0,
              min: 0,
              nullCount: 0,
              std: 0
            };
          } else {
            metaData[col.name] = {
              count: col.summary.count,
              kind: 'FLOAT',
              max: col.summary.floatSummary?.max,
              mean: col.summary.floatSummary?.mean,
              median: col.summary.floatSummary?.median,
              min: col.summary.floatSummary?.min,
              nullCount: col.summary.nullCount,
              std: col.summary.floatSummary?.std
            };
          }
          break;
        case 'ENUM':
          col.enumData.slice(rowStart, rowEnd).map((entry, i) => {
            if (!rows[i]) {
              rows[i] = {};
            }

            if (columnIdsModifyData.includes(col.id)) {
              rows[i][col.name] = 'Hidden';
            } else {
              rows[i][col.name] = entry.value;
            }
          });

          if (columnIdsModifyMetadata.includes(col.id)) {
            metaData[col.name] = {
              count: 0,
              kind: 'ENUM',
              nullCount: 0
            };
          } else {
            metaData[col.name] = {
              count: col.summary.count,
              kind: 'ENUM',
              nullCount: col.summary.nullCount
            };
          }
          break;
        case 'DATETIME':
          col.datetimeData.slice(rowStart, rowEnd).map((entry, i) => {
            if (!rows[i]) {
              rows[i] = {};
            }
            if (columnIdsModifyData.includes(col.id)) {
              rows[i][col.name] = 'Hidden';
            } else {
              rows[i][col.name] = entry.value?.toISOString() ?? null;
            }
          });

          if (columnIdsModifyMetadata.includes(col.id)) {
            metaData[col.name] = {
              count: 0,
              kind: 'DATETIME',
              max: new Date(0),
              min: new Date(0),
              nullCount: 0
            };
          } else {
            metaData[col.name] = {
              count: col.summary.count,
              kind: 'DATETIME',
              max: col.summary.datetimeSummary?.max ? col.summary.datetimeSummary?.max : new Date(),
              min: col.summary.datetimeSummary?.min ? col.summary.datetimeSummary?.min : new Date(),
              nullCount: col.summary.nullCount
            };
          }
          break;
      }
    }

    const dataView: TabularDatasetView = {
      columnIds,
      columns,
      metadata: metaData,
      primaryKeys: tabularData.primaryKeys,
      rows,
      totalNumberOfColumns: tabularData.columns.length,
      totalNumberOfRows: numberOfRows
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
      try {
        const col = df.getColumn(key);
        if (col.nullCount() > 0) {
          return false;
        }
      } catch {
        throw new NotFoundException(`Cannot find primary key ${key} or the primary key column contains null value`);
      }
    }

    const checkPrimaryKeysArray: boolean[] = df
      .select(...primaryKeys)
      .isUnique()
      .toArray();
    return checkPrimaryKeysArray.reduce((prev, curr) => prev && curr);
  }
}

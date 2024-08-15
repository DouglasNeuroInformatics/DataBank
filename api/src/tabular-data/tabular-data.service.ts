/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { ColumnSummary, DatasetViewPaginationDto, ProjectDatasetDto, TabularDatasetView } from '@databank/types';
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

  async getProjectDatasetView(
    projectDatasetDto: ProjectDatasetDto,
    _rowPagination: DatasetViewPaginationDto,
    _columnPagination: DatasetViewPaginationDto
  ) {
    const columnIds: string[] = [];
    const columns: string[] = [];
    const metaData = {};
    const rows: { [key: string]: boolean | number | string }[] = [];
    const numberOfRows = 10;

    for (let col of projectDatasetDto.columns) {
      columnIds.push(col.columnId);
      const getColumnViewDto: GetColumnViewDto = {
        ...col,
        rowMax: projectDatasetDto.rowFilter ? projectDatasetDto.rowFilter.rowMax : null,
        rowMin: projectDatasetDto.rowFilter ? projectDatasetDto.rowFilter.rowMin : 0
      };
      const currColumnView = await this.columnsService.getColumnView(getColumnViewDto);
      // 2. need to handle column type filter HANDLE HERE, throw an error if there is a conflict between the column ID and the type filter
      if (!projectDatasetDto.useDataTypeFilter || projectDatasetDto.dataTypeFilters.includes(currColumnView.kind)) {
        columns.push(currColumnView.name);
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

    // we can first get all the columns using the row filter
    // metadata needs to be recalculated for columns that uses trim and hash

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

  async getViewById(
    tabularDataId: string,
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

    let columnIds: string[] = [];
    let columns: string[] = [];

    let rows: { [key: string]: boolean | null | number | string }[] = [];
    if (!tabularData.columns[0]?.id) {
      throw new NotFoundException('No columns in this tabular data.');
    }

    const rowStart = (rowPagination.currentPage - 1) * rowPagination.itemsPerPage;
    const rowEnd = rowPagination.currentPage * rowPagination.itemsPerPage - 1;
    const numberOfRows = await this.columnsService.getLengthById(tabularData.columns[0]?.id);
    const columnStart = (columnPagination.currentPage - 1) * columnPagination.itemsPerPage;
    const columnEnd = columnPagination.currentPage * columnPagination.itemsPerPage - 1;

    for (let i = rowStart; i < rowEnd + 1; i++) {
      rows.push({});
    }

    let metaData: { [key: string]: ColumnSummary } = {};

    for (let col of tabularData.columns.slice(columnStart, columnEnd + 1)) {
      columnIds.push(col.id);
      columns.push(col.name);

      switch (col.kind) {
        case 'STRING':
          col.stringData.slice(rowStart, rowEnd + 1).map((entry, i) => {
            if (!rows[i]) {
              rows[i] = {};
            }

            rows[i][col.name] = entry.value;
          });

          metaData[col.name] = {
            count: col.summary.count,
            kind: 'STRING',
            nullCount: col.summary.nullCount
          };
          break;
        case 'BOOLEAN':
          col.booleanData.slice(rowStart, rowEnd + 1).map((entry, i) => {
            if (!rows[i]) {
              rows[i] = {};
            }
            rows[i][col.name] = entry.value;
          });
          metaData[col.name] = {
            count: col.summary.count,
            kind: 'BOOLEAN',
            nullCount: col.summary.nullCount,
            // TODO: find the true count
            trueCount: 0
          };
          break;
        case 'INT':
          col.intData.slice(rowStart, rowEnd + 1).map((entry, i) => {
            if (!rows[i]) {
              rows[i] = {};
            }
            rows[i][col.name] = entry.value;
          });
          metaData[col.name] = {
            count: col.summary.count,
            kind: 'INT',
            max: col.summary.intSummary?.max,
            median: col.summary.intSummary?.median,
            min: col.summary.intSummary?.min,
            mode: col.summary.intSummary?.mode,
            nullCount: col.summary.nullCount,
            std: col.summary.intSummary?.std
          };
          break;
        case 'FLOAT':
          col.floatData.slice(rowStart, rowEnd + 1).map((entry, i) => {
            if (!rows[i]) {
              rows[i] = {};
            }
            rows[i][col.name] = entry.value;
          });
          metaData[col.name] = {
            count: col.summary.count,
            kind: 'FLOAT',
            max: col.summary.floatSummary?.max,
            median: col.summary.floatSummary?.median,
            min: col.summary.floatSummary?.min,
            nullCount: col.summary.nullCount,
            std: col.summary.floatSummary?.std
          };
          break;
        case 'ENUM':
          col.enumData.slice(rowStart, rowEnd + 1).map((entry, i) => {
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
          col.datetimeData.slice(rowStart, rowEnd + 1).map((entry, i) => {
            if (!rows[i]) {
              rows[i] = {};
            }
            rows[i][col.name] = entry.value?.toDateString() ?? null;
          });
          metaData[col.name] = {
            count: col.summary.count,
            kind: 'DATETIME',
            max: col.summary.datetimeSummary?.max ? col.summary.datetimeSummary?.max : new Date(),
            min: col.summary.datetimeSummary?.min ? col.summary.datetimeSummary?.min : new Date(),
            nullCount: col.summary.nullCount
          };
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
      const col = df.getColumn(key);
      if (col.nullCount() > 0) {
        return false;
      }
    }

    const checkPrimaryKeysArray: boolean[] = df
      .select(...primaryKeys)
      .isUnique()
      .toArray();
    return checkPrimaryKeysArray.reduce((prev, curr) => prev && curr);
  }
}

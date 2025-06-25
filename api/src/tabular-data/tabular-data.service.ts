import type {
  DatasetViewPagination,
  GetColumnViewDto,
  ProjectTabularDatasetView,
  TabularColumnSummary,
  TabularDatasetView,
  UpdatePrimaryKeys
} from '@databank/core';
import type { Model } from '@douglasneuroinformatics/libnest';
import { InjectModel } from '@douglasneuroinformatics/libnest';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { PermissionLevel } from '@prisma/client';
import pl from 'nodejs-polars';
import type { DataFrame } from 'nodejs-polars';

import { ColumnsService } from '@/columns/columns.service';
import type { ProjectDatasetDto } from '@/projects/dto/projects.dto';

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

    for (const col of tabularData.columns) {
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
      const indexSeries = pl.Series('__autogen_id', indexArray);
      df.insertAtIdx(0, indexSeries);
      primaryKeys.push('__autogen_id');
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
      for (const col of df.getColumns()) {
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
    rowPagination: DatasetViewPagination,
    columnPagination: DatasetViewPagination
  ) {
    const columnIds: { [key: string]: string } = {};
    const columns: string[] = [];
    const metaData: { [key: string]: any } = {};
    const rows: { [key: string]: boolean | number | string }[] = [];

    const rowStart = (rowPagination.currentPage - 1) * rowPagination.itemsPerPage;
    const rowEnd = rowPagination.currentPage * rowPagination.itemsPerPage;
    const columnStart = (columnPagination.currentPage - 1) * columnPagination.itemsPerPage;
    const columnEnd = columnPagination.currentPage * columnPagination.itemsPerPage;

    for (const col of projectDatasetDto.columns.slice(columnStart, columnEnd)) {
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
        kind: { type: currColumnView.kind },
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
        case 'DATETIME':
          currColumnView.datetimeData.map((entry, i) => {
            rows[i] ??= {};
            rows[i][currColumnView.name] = entry.value!.toDateString()!;
          });
          break;
        case 'ENUM':
          currColumnView.enumData.map((entry, i) => {
            rows[i] ??= {};
            rows[i][currColumnView.name] = entry.value!;
          });
          break;
        case 'FLOAT':
          currColumnView.floatData.map((entry, i) => {
            rows[i] ??= {};
            rows[i][currColumnView.name] = entry.value!;
          });
          break;
        case 'INT':
          currColumnView.intData.map((entry, i) => {
            rows[i] ??= {};
            rows[i][currColumnView.name] = entry.value!;
          });
          break;
        case 'STRING':
          currColumnView.stringData.map((entry, i) => {
            rows[i] ??= {};
            rows[i][currColumnView.name] = entry.value!;
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
    rowPagination: DatasetViewPagination,
    columnPagination: DatasetViewPagination
  ) {
    const tabularData = await this.tabularDataModel.findUnique({
      where: {
        id: tabularDataId
      }
    });

    if (!tabularData) {
      throw new NotFoundException('No tabular data found!');
    }

    // type RawQueryColumns
    const columnsFromDB = await this.columnsService.findManyByTabularDataId(tabularDataId, columnPagination);
    const numberOfColumns = await this.columnsService.getNumberOfColumns(tabularDataId);

    if (!columnsFromDB || columnsFromDB.length === 0) {
      throw new NotFoundException('No column found in this tabular dataset!');
    }

    const columnIdsModifyData: string[] = [];
    const columnIdsModifyMetadata: string[] = [];

    if (userStatus === 'VERIFIED') {
      columnsFromDB.forEach((col) => {
        if (col.dataPermission === 'MANAGER') {
          columnIdsModifyData.push(col._id.$oid);
        }
        if (col.summaryPermission === 'MANAGER') {
          columnIdsModifyMetadata.push(col._id.$oid);
        }
      });
    } else if (userStatus === 'LOGIN') {
      columnsFromDB.forEach((col) => {
        if (col.dataPermission === 'MANAGER' || col.dataPermission === 'VERIFIED') {
          columnIdsModifyData.push(col._id.$oid);
        }
        if (col.summaryPermission === 'MANAGER' || col.summaryPermission === 'VERIFIED') {
          columnIdsModifyMetadata.push(col._id.$oid);
        }
      });
    } else if (userStatus === 'PUBLIC') {
      columnsFromDB.forEach((col) => {
        if (col.dataPermission === 'MANAGER' || col.dataPermission === 'LOGIN' || col.dataPermission === 'VERIFIED') {
          columnIdsModifyData.push(col._id.$oid);
        }
        if (
          col.summaryPermission === 'MANAGER' ||
          col.summaryPermission === 'VERIFIED' ||
          col.summaryPermission === 'LOGIN'
        ) {
          columnIdsModifyMetadata.push(col._id.$oid);
        }
      });
    }

    const columnIds: { [key: string]: string } = {};
    const columns: string[] = [];

    const rows: { [key: string]: boolean | null | number | string }[] = [];

    const rowStart = (rowPagination.currentPage - 1) * rowPagination.itemsPerPage;
    const rowEnd = rowPagination.currentPage * rowPagination.itemsPerPage;
    const numberOfRows = await this.columnsService.getLengthById(columnsFromDB[0]!._id.$oid);

    for (let i = rowStart; i < rowEnd; i++) {
      rows.push({});
    }

    const metaData: { [key: string]: TabularColumnSummary } = {};

    for (const col of columnsFromDB) {
      columnIds[col.name] = col._id.$oid;
      columns.push(col.name);

      switch (col.kind) {
        case 'DATETIME':
          col.datetimeData.slice(rowStart, rowEnd).map((entry, i) => {
            rows[i] ??= {};
            if (columnIdsModifyData.includes(col._id.$oid)) {
              rows[i][col.name] = 'Hidden';
            } else {
              rows[i][col.name] = entry.value?.toISOString() ?? null;
            }
          });

          if (columnIdsModifyMetadata.includes(col._id.$oid)) {
            metaData[col.name] = {
              count: 0,
              datetimeSummary: {
                max: new Date(0),
                min: new Date(0)
              },
              kind: 'DATETIME',
              nullable: col.nullable,
              nullCount: 0
            };
          } else {
            metaData[col.name] = {
              count: col.count,
              datetimeSummary: col.datetimeSummary,
              kind: 'DATETIME',
              nullable: col.nullable,
              nullCount: col.nullCount
            };
          }
          break;
        case 'ENUM':
          col.enumData.slice(rowStart, rowEnd).map((entry, i) => {
            rows[i] ??= {};

            if (columnIdsModifyData.includes(col._id.$oid)) {
              rows[i][col.name] = 'Hidden';
            } else {
              rows[i][col.name] = entry.value ?? null;
            }
          });

          if (columnIdsModifyMetadata.includes(col._id.$oid)) {
            metaData[col.name] = {
              count: 0,
              enumSummary: {
                distribution: {}
              },
              kind: 'ENUM',
              nullable: col.nullable,
              nullCount: 0
            };
          } else {
            metaData[col.name] = {
              count: 0,
              enumSummary: col.enumSummary,
              kind: 'ENUM',
              nullable: col.nullable,
              nullCount: 0
            };
          }
          break;
        case 'FLOAT':
          col.floatData.slice(rowStart, rowEnd).map((entry, i) => {
            rows[i] ??= {};
            if (columnIdsModifyData.includes(col._id.$oid)) {
              rows[i][col.name] = 'Hidden';
            } else {
              rows[i][col.name] = entry.value ?? null;
            }
          });

          if (columnIdsModifyMetadata.includes(col._id.$oid)) {
            metaData[col.name] = {
              count: 0,
              floatSummary: {
                max: 0,
                mean: 0,
                median: 0,
                min: 0,
                std: 0
              },
              kind: 'FLOAT',
              nullable: col.nullable,
              nullCount: col.nullCount
            };
          } else {
            metaData[col.name] = {
              count: 0,
              floatSummary: col.floatSummary,
              kind: 'FLOAT',
              nullable: col.nullable,
              nullCount: col.nullCount
            };
          }
          break;
        case 'INT':
          col.intData.slice(rowStart, rowEnd).map((entry, i) => {
            rows[i] ??= {};
            if (columnIdsModifyData.includes(col._id.$oid)) {
              rows[i][col.name] = 'Hidden';
            } else {
              rows[i][col.name] = entry.value ?? null;
            }
          });
          if (columnIdsModifyMetadata.includes(col._id.$oid)) {
            metaData[col.name] = {
              count: 0,
              intSummary: {
                max: 0,
                mean: 0,
                median: 0,
                min: 0,
                mode: 0,
                std: 0
              },
              kind: 'INT',
              nullable: col.nullable,
              nullCount: 0
            };
          } else {
            metaData[col.name] = {
              count: col.count,
              intSummary: col.intSummary,
              kind: 'INT',
              nullable: col.nullable,
              nullCount: col.nullCount
            };
          }
          break;
        case 'STRING':
          col.stringData.slice(rowStart, rowEnd).map((entry, i) => {
            rows[i] ??= {};

            if (columnIdsModifyData.includes(col._id.$oid)) {
              rows[i][col.name] = 'Hidden';
            } else {
              rows[i][col.name] = entry.value ?? null;
            }
          });

          if (columnIdsModifyMetadata.includes(col._id.$oid)) {
            metaData[col.name] = {
              count: 0,
              kind: 'STRING',
              nullable: col.nullable,
              nullCount: 0
            };
          } else {
            metaData[col.name] = {
              count: col.count,
              kind: 'STRING',
              nullable: col.nullable,
              nullCount: col.nullCount
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
      totalNumberOfColumns: numberOfColumns,
      totalNumberOfRows: numberOfRows
    };

    return dataView;
  }

  // update Primary keys for a tabular column
  async updatePrimaryKeys(tabularDataId: string, updatePrimaryKeysDto: UpdatePrimaryKeys) {
    return await this.tabularDataModel.update({
      data: updatePrimaryKeysDto,
      where: {
        id: tabularDataId
      }
    });
  }

  private primaryKeyCheck(primaryKeys: string[], df: DataFrame): boolean {
    for (const key of primaryKeys) {
      try {
        const col = df.getColumn(key);
        if (col.nullCount() > 0) {
          return false;
        }
      } catch {
        throw new NotFoundException(`Cannot find primary key ${key} or the primary key column contains null value`);
      }
    }

    const checkPrimaryKeysArray = df
      .select(...primaryKeys)
      .isUnique()
      .toTypedArray() as boolean[];
    return checkPrimaryKeysArray.reduce((prev, curr) => prev && curr);
  }
}

import {
  $DatasetViewPagination,
  $GetColumnViewDto,
  $ProjectDataset,
  $ProjectTabularDatasetView,
  $TabularColumnSummary,
  $TabularDatasetView,
  $UpdatePrimaryKeys
} from '@databank/core';
import type { Model } from '@douglasneuroinformatics/libnest';
import { InjectModel } from '@douglasneuroinformatics/libnest';
import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import type { PermissionLevel, Prisma } from '@prisma/client';
import pl from 'nodejs-polars';
import type { DataFrame } from 'nodejs-polars';

import { ColumnsService } from '@/columns/columns.service';

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
      throw new UnprocessableEntityException('Dataset failed primary keys check!');
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
      throw new UnprocessableEntityException('Cannot create Tabular Dataset!');
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
    projectDataset: $ProjectDataset,
    rowPagination: $DatasetViewPagination,
    columnPagination: $DatasetViewPagination
  ): Promise<$ProjectTabularDatasetView> {
    const columnIds: { [key: string]: string } = {};
    const columns: string[] = [];
    const metaData: { [key: string]: $TabularColumnSummary } = {};
    const rows: { [key: string]: boolean | number | string }[] = [];

    const rowStart = (rowPagination.currentPage - 1) * rowPagination.itemsPerPage;
    const rowEnd = rowPagination.currentPage * rowPagination.itemsPerPage;
    const columnStart = (columnPagination.currentPage - 1) * columnPagination.itemsPerPage;
    const columnEnd = columnPagination.currentPage * columnPagination.itemsPerPage;

    for (const colId of projectDataset.columnIds.slice(columnStart, columnEnd)) {
      const getColumnViewDto: $GetColumnViewDto = {
        columnId: colId,
        rowMax: projectDataset.rowConfig.rowMax ?? undefined,
        rowMin: projectDataset.rowConfig.rowMin
      };

      if (colId in projectDataset.columnConfigs) {
        if (projectDataset.columnConfigs[colId]!.hash) {
          getColumnViewDto.hash = {
            length: projectDataset.columnConfigs[colId]!.hash.length,
            salt: projectDataset.columnConfigs[colId]!.hash.salt ?? undefined
          };
        }

        if (projectDataset.columnConfigs[colId]!.trim) {
          getColumnViewDto.trim = {
            end: projectDataset.columnConfigs[colId]!.trim.end ?? undefined,
            start: projectDataset.columnConfigs[colId]!.trim.start
          };
        }
      }

      const currColumnView = await this.columnsService.getProjectColumnView(getColumnViewDto);
      columns.push(currColumnView.name);
      columnIds[currColumnView.name] = currColumnView.id;

      switch (currColumnView.kind) {
        case 'DATETIME':
          currColumnView.datetimeData.map((entry, i) => {
            rows[i] ??= {};
            rows[i][currColumnView.name] = entry.value!.toDateString()!;
          });
          metaData[currColumnView.name] = {
            count: currColumnView.summary.count,
            dataPermission: currColumnView.dataPermission,
            datetimeSummary: currColumnView.summary.datetimeSummary!,
            kind: currColumnView.kind,
            metadataPermission: currColumnView.summaryPermission,
            nullable: currColumnView.nullable,
            nullCount: currColumnView.summary.nullCount
          };
          break;
        case 'ENUM': {
          currColumnView.enumData.map((entry, i) => {
            rows[i] ??= {};
            rows[i][currColumnView.name] = entry.value!;
          });
          metaData[currColumnView.name] = {
            count: currColumnView.summary.count,
            dataPermission: currColumnView.dataPermission,
            enumSummary: {
              distribution: currColumnView.summary.enumSummary?.distribution as unknown as Prisma.JsonArray as {
                '': string;
                count: number;
              }[]
            },
            kind: currColumnView.kind,
            metadataPermission: currColumnView.summaryPermission,
            nullable: currColumnView.nullable,
            nullCount: currColumnView.summary.nullCount
          };
          break;
        }
        case 'FLOAT':
          currColumnView.floatData.map((entry, i) => {
            rows[i] ??= {};
            rows[i][currColumnView.name] = entry.value!;
          });
          metaData[currColumnView.name] = {
            count: currColumnView.summary.count,
            dataPermission: currColumnView.dataPermission,
            floatSummary: currColumnView.summary.floatSummary!,
            kind: currColumnView.kind,
            metadataPermission: currColumnView.summaryPermission,
            nullable: currColumnView.nullable,
            nullCount: currColumnView.summary.nullCount
          };
          break;
        case 'INT':
          currColumnView.intData.map((entry, i) => {
            rows[i] ??= {};
            rows[i][currColumnView.name] = entry.value!;
          });
          metaData[currColumnView.name] = {
            count: currColumnView.summary.count,
            dataPermission: currColumnView.dataPermission,
            intSummary: currColumnView.summary.intSummary!,
            kind: currColumnView.kind,
            metadataPermission: currColumnView.summaryPermission,
            nullable: currColumnView.nullable,
            nullCount: currColumnView.summary.nullCount
          };
          break;
        case 'STRING':
          currColumnView.stringData.map((entry, i) => {
            rows[i] ??= {};
            rows[i][currColumnView.name] = entry.value!;
          });
          metaData[currColumnView.name] = {
            count: currColumnView.summary.count,
            dataPermission: currColumnView.dataPermission,
            kind: currColumnView.kind,
            metadataPermission: currColumnView.summaryPermission,
            nullable: currColumnView.nullable,
            nullCount: currColumnView.summary.nullCount
          };
          break;
      }
    }

    const dataView: $ProjectTabularDatasetView = {
      columnIds,
      columns,
      metadata: metaData,
      rows: rows.slice(rowStart, rowEnd),
      totalNumberOfColumns: projectDataset.columnIds.length,
      totalNumberOfRows: rows.length
    };

    return dataView;
  }

  async getViewById(
    tabularDataId: string,
    userStatus: PermissionLevel,
    rowPagination: $DatasetViewPagination,
    columnPagination: $DatasetViewPagination
  ): Promise<$TabularDatasetView> {
    const tabularData = await this.tabularDataModel.findUnique({
      where: {
        id: tabularDataId
      }
    });

    if (!tabularData) {
      throw new NotFoundException('No tabular data found!');
    }

    const columnsFromDB = await this.columnsService.findManyByTabularDataId(tabularDataId, columnPagination);
    const numberOfColumns = await this.columnsService.getNumberOfColumns(tabularDataId);

    if (!columnsFromDB || columnsFromDB.length === 0) {
      throw new NotFoundException('No column found in this tabular dataset!');
    }

    const columnIdsModifyData = new Set<string>();
    const columnIdsModifyMetadata = new Set<string>();

    if (userStatus === 'VERIFIED') {
      columnsFromDB.forEach((col) => {
        if (col.dataPermission === 'MANAGER') {
          columnIdsModifyData.add(col._id.$oid);
        }
        if (col.summaryPermission === 'MANAGER') {
          columnIdsModifyMetadata.add(col._id.$oid);
        }
      });
    } else if (userStatus === 'LOGIN') {
      columnsFromDB.forEach((col) => {
        if (col.dataPermission === 'MANAGER' || col.dataPermission === 'VERIFIED') {
          columnIdsModifyData.add(col._id.$oid);
        }
        if (col.summaryPermission === 'MANAGER' || col.summaryPermission === 'VERIFIED') {
          columnIdsModifyMetadata.add(col._id.$oid);
        }
      });
    } else if (userStatus === 'PUBLIC') {
      columnsFromDB.forEach((col) => {
        if (col.dataPermission === 'MANAGER' || col.dataPermission === 'LOGIN' || col.dataPermission === 'VERIFIED') {
          columnIdsModifyData.add(col._id.$oid);
        }
        if (
          col.summaryPermission === 'MANAGER' ||
          col.summaryPermission === 'VERIFIED' ||
          col.summaryPermission === 'LOGIN'
        ) {
          columnIdsModifyMetadata.add(col._id.$oid);
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

    const metaData: { [key: string]: $TabularColumnSummary } = {};

    for (const col of columnsFromDB) {
      columnIds[col.name] = col._id.$oid;
      columns.push(col.name);

      switch (col.kind) {
        case 'DATETIME':
          col.datetimeData!.slice(rowStart, rowEnd).map((entry, i) => {
            rows[i] ??= {};
            if (columnIdsModifyData.has(col._id.$oid)) {
              rows[i][col.name] = 'Hidden';
            } else {
              rows[i][col.name] = entry.value ? new Date(entry.value.$date!).toDateString() : null;
            }
          });

          if (!columnIdsModifyMetadata.has(col._id.$oid)) {
            metaData[col.name] = {
              count: col.summary.count,
              dataPermission: col.dataPermission,
              datetimeSummary: {
                max: col.summary.datetimeSummary!.max.$date,
                min: col.summary.datetimeSummary!.min.$date
              },
              kind: 'DATETIME',
              metadataPermission: col.summaryPermission,
              nullable: col.nullable,
              nullCount: col.summary.nullCount
            };
          }
          break;
        case 'ENUM':
          col.enumData!.slice(rowStart, rowEnd).map((entry, i) => {
            rows[i] ??= {};

            if (columnIdsModifyData.has(col._id.$oid)) {
              rows[i][col.name] = 'Hidden';
            } else {
              rows[i][col.name] = entry.value ?? null;
            }
          });

          if (!columnIdsModifyMetadata.has(col._id.$oid)) {
            metaData[col.name] = {
              count: col.summary.count,
              dataPermission: col.dataPermission,
              enumSummary: col.summary.enumSummary!,
              kind: 'ENUM',
              metadataPermission: col.summaryPermission,
              nullable: col.nullable,
              nullCount: col.summary.nullCount
            };
          }
          break;
        case 'FLOAT':
          col.floatData!.slice(rowStart, rowEnd).map((entry, i) => {
            rows[i] ??= {};
            if (columnIdsModifyData.has(col._id.$oid)) {
              rows[i][col.name] = 'Hidden';
            } else {
              rows[i][col.name] = entry.value ?? null;
            }
          });

          if (!columnIdsModifyMetadata.has(col._id.$oid)) {
            metaData[col.name] = {
              count: col.summary.count,
              dataPermission: col.dataPermission,
              floatSummary: col.summary.floatSummary!,
              kind: 'FLOAT',
              metadataPermission: col.summaryPermission,
              nullable: col.nullable,
              nullCount: col.summary.nullCount
            };
          }
          break;
        case 'INT':
          col.intData!.slice(rowStart, rowEnd).map((entry, i) => {
            rows[i] ??= {};
            if (columnIdsModifyData.has(col._id.$oid)) {
              rows[i][col.name] = 'Hidden';
            } else {
              rows[i][col.name] = entry.value ?? null;
            }
          });
          if (!columnIdsModifyMetadata.has(col._id.$oid)) {
            metaData[col.name] = {
              count: col.summary.count,
              dataPermission: col.dataPermission,
              intSummary: col.summary.intSummary!,
              kind: 'INT',
              metadataPermission: col.summaryPermission,
              nullable: col.nullable,
              nullCount: col.summary.nullCount
            };
          }
          break;
        case 'STRING':
          col.stringData!.slice(rowStart, rowEnd).map((entry, i) => {
            rows[i] ??= {};

            if (columnIdsModifyData.has(col._id.$oid)) {
              rows[i][col.name] = 'Hidden';
            } else {
              rows[i][col.name] = entry.value ?? null;
            }
          });

          if (!columnIdsModifyMetadata.has(col._id.$oid)) {
            metaData[col.name] = {
              count: col.summary.count,
              dataPermission: col.dataPermission,
              kind: 'STRING',
              metadataPermission: col.summaryPermission,
              nullable: col.nullable,
              nullCount: col.summary.nullCount
            };
          }
          break;
      }
    }

    const dataView: $TabularDatasetView = {
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
  async updatePrimaryKeys(tabularDataId: string, updatePrimaryKeysDto: $UpdatePrimaryKeys) {
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
      .toArray() as boolean[];

    return checkPrimaryKeysArray.reduce((prev, curr) => prev && curr);
  }
}

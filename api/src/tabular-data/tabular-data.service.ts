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

  async getViewById(projectDatasetDto: ProjectDatasetDto) {
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

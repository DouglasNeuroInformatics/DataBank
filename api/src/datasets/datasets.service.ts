import module from 'node:module';

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PermissionLevel, PrismaClient } from '@prisma/client';
import type { DataFrame } from 'nodejs-polars';

import type { ColumnsService } from '@/columns/columns.service.js';
import { InjectModel, InjectPrismaClient } from '@/core/decorators/inject-prisma-client.decorator';
import type { Model } from '@/prisma/prisma.types';
import type { ProjectDatasetDto } from '@/projects/zod/projects.js';
import type { TabularDataService } from '@/tabular-data/tabular-data.service.js';
import { UsersService } from '@/users/users.service.js';

import type { CreateTabularDatasetDto } from './zod/dataset.js';

const require = module.createRequire(import.meta.url);

const pl: typeof import('nodejs-polars').default = require('nodejs-polars');

@Injectable()
export class DatasetsService {
  constructor(
    @InjectModel('Dataset') private datasetModel: Model<'Dataset'>,
    @InjectPrismaClient() private prisma: PrismaClient,
    private readonly usersService: UsersService,
    private readonly columnService: ColumnsService,
    private readonly tabularDataService: TabularDataService
  ) {}

  async addManager(datasetId: string, managerId: string, managerIdToAdd: string) {
    const dataset = await this.canModifyDataset(datasetId, managerId);

    const managerToAdd = await this.usersService.findById(managerId);

    const newDatasetIds = managerToAdd.datasetId;
    newDatasetIds.push(datasetId);

    const updateNewManagerDatasetsIds = this.usersService.updateUser(managerIdToAdd, {
      datasetId: newDatasetIds
    });

    const newManagerIds = dataset.managerIds;
    newManagerIds.push(managerIdToAdd);

    const updateManager = this.datasetModel.update({
      data: {
        managerIds: newManagerIds
      },
      where: {
        id: dataset.id
      }
    });

    return await this.prisma.$transaction([updateNewManagerDatasetsIds, updateManager]);
  }

  async canModifyDataset(datasetId: string, currentUserId: string) {
    const dataset = await this.datasetModel.findUnique({
      include: {
        tabularData: true
      },
      where: {
        id: datasetId
      }
    });
    if (!dataset) {
      throw new NotFoundException();
    }
    if (!(currentUserId in dataset.managerIds)) {
      throw new ForbiddenException('Only managers can modify this dataset!');
    }
    return dataset;
  }

  async changeDatasetDataPermission(datasetId: string, currentUserId: string, permissionLevel: PermissionLevel) {
    const dataset = await this.canModifyDataset(datasetId, currentUserId);

    if (!dataset.tabularData) {
      throw new NotFoundException(`There is not tabular data in this dataset with id ${datasetId}`);
    }

    return await this.columnService.updateMany(dataset.tabularData.id, {
      dataPermission: permissionLevel
    });
  }

  async changeDatasetMetadataPermission(datasetId: string, currentUserId: string, permissionLevel: PermissionLevel) {
    const dataset = await this.canModifyDataset(datasetId, currentUserId);
    const tabularData = await this.tabularDataModel.findUniqueOrThrow({
      where: {
        datasetId: dataset.id
      }
    });
    const updateColumns = await this.columnModel.updateMany({
      data: {
        summaryPermission: permissionLevel
      },
      where: {
        tabularDataId: tabularData.id
      }
    });
    return updateColumns;
  }

  async createDataset(
    createTabularDatasetDto: CreateTabularDatasetDto,
    file: Express.Multer.File | string,
    managerId: string
  ) {
    let csvString: string;
    let df: DataFrame;
    if (typeof file === 'string') {
      csvString = file;
    } else {
      // file received through the network is stored in memory buffer which is converted to a string
      csvString = file.buffer.toString().replaceAll('\t', ','); // polars has a bug parsing tsv, this is a hack for it to work
    }
    df = pl.readCSV(csvString, { tryParseDates: true });

    // for datasets without primary keys, generate a sequential id column
    if (createTabularDatasetDto.primaryKeys.length === 0) {
      const indexArray = [];
      for (let i = 0; i < df.shape.height; i++) {
        indexArray.push(i);
      }
      const indexSeries = pl.Series('id', indexArray);
      df.insertAtIdx(0, indexSeries);
      createTabularDatasetDto.primaryKeys.push('id');
    }

    if (!this.primaryKeyCheck(createTabularDatasetDto.primaryKeys, df)) {
      throw new ForbiddenException('Dataset failed primary keys check!');
    }

    const dataset = await this.datasetModel.create({
      data: {
        datasetType: 'TABULAR',
        description: createTabularDatasetDto.description,
        isReadyToShare: false,
        managerIds: [managerId],
        name: createTabularDatasetDto.name
      }
    });

    const tabularData = await this.tabularDataModel.create({
      data: {
        datasetId: dataset.id,
        primaryKeys: createTabularDatasetDto.primaryKeys
      }
    });

    for (let col of df.getColumns()) {
      // create a float column
      if (col.isFloat()) {
        this.columnService.createColumn({
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
        this.columnService.createColumn({
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
        this.columnService.createColumn({
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
        this.columnService.createColumn({
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
      this.columnService.createColumn({
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

    return dataset;
  }

  async deleteDataset(datasetId: string, currentUserId: string) {
    const dataset = await this.canModifyDataset(datasetId, currentUserId);

    if (!dataset.tabularData) {
      throw new NotFoundException(`There is not tabular data in this dataset with id ${datasetId}`);
    }

    const deleteTabularData = this.tabularDataService.deleteById(dataset.tabularData.id);

    const deleteColumns = this.columnService.deleteByTabularDataId(dataset.tabularData.id);

    const deleteTargetDataset = this.datasetModel.delete({
      where: {
        id: dataset.id
      }
    });

    // need to update all users that are managers of this dataset
    const managersToUpdate = await this.usersService.findManyByDatasetId(dataset.id);

    const updateManagers = [];

    for (let manager of managersToUpdate) {
      let newDatasetId = manager.datasetId.filter((val) => val !== dataset.id);
      updateManagers.push(
        this.usersService.updateUser(manager.id, {
          datasetId: newDatasetId
        })
      );
    }

    return await this.prisma.$transaction([deleteColumns, deleteTabularData, ...updateManagers, deleteTargetDataset]);
  }

  async getAvailable(currentUserId: string) {
    const availableDatasets = await this.datasetModel.findMany({
      where: {
        OR: [
          { isReadyToShare: true },
          {
            managerIds: {
              has: currentUserId
            }
          }
        ]
      }
    });
    return availableDatasets;
  }

  async getById(datasetId: string, currentUserIduserId: string) {
    const dataset = await this.datasetModel.findUnique({
      where: {
        id: datasetId
      }
    });
    if (!dataset) {
      throw new NotFoundException();
    }
    if (!dataset.isReadyToShare && !(currentUserIduserId in dataset.managerIds)) {
      throw new ForbiddenException('The dataset is not ready for share!');
    }

    return dataset;
  }

  async getDatasetView(currentUserId: string, projectDatasetDto: ProjectDatasetDto) {
    // if currentUser cannot modify dataset, return dataset view
    const dataset = await this.datasetModel.findUnique({
      include: {
        tabularData: {
          include: {
            columns: true
          }
        }
      },
      where: {
        id: projectDatasetDto.datasetId
      }
    });

    if (!dataset) {
      throw new NotFoundException(`Cannot find dataset with id ${projectDatasetDto.datasetId}`);
    }

    if (!(currentUserId in dataset.managerIds)) {
      // replace the tabular data section according to the rule
      // row range should be handled in the tabular data level
      // data type filter should be handled in the tabular data level
      // intra-column data hashing and trimming should be handled by the column service
      const tabularDataView = await this.tabularDataService;
      return 'THE DATASET VIEW';
    }

    return dataset;
    // if currentUser can modify dataset, return ???
    // get the dataset including the tabular data
    // get a set of columns based on the tabular data id and column names
    // call the getColumnView function for each column?
    // return the view of the dataset
  }

  async removeManager(datasetId: string, managerId: string, managerIdToRemove: string) {
    const dataset = await this.canModifyDataset(datasetId, managerId);

    const managerToRemove = await this.usersService.findById(managerIdToRemove);

    if (!managerToRemove) {
      throw new NotFoundException(`Manager with id ${managerIdToRemove} is not found!`);
    }

    const newManagerIds = dataset.managerIds.filter((val) => val != managerIdToRemove);

    const updateDatasetManagerIds = this.datasetModel.update({
      data: {
        managerIds: newManagerIds
      },
      where: {
        id: datasetId
      }
    });

    const newDatasetIds = managerToRemove.datasetId.filter((val) => val != datasetId);

    const updateManagerToRemoveDatasetIds = this.usersService.updateUser(managerIdToRemove, {
      datasetId: newDatasetIds
    });

    return await this.prisma.$transaction([updateDatasetManagerIds, updateManagerToRemoveDatasetIds]);
  }

  async setReadyToShare(datasetId: string, currentUserId: string) {
    const dataset = await this.canModifyDataset(datasetId, currentUserId);
    if (dataset.isReadyToShare) {
      throw new ForbiddenException('This dataset is not found or is already set to ready to share!');
    }

    const updateDataset = this.datasetModel.update({
      data: {
        isReadyToShare: true
      },
      where: {
        id: datasetId
      }
    });
    return await this.prisma.$transaction([updateDataset]);
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

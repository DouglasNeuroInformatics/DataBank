import type { DatasetCardProps } from '@databank/types';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PermissionLevel, PrismaClient } from '@prisma/client';

import { ColumnsService } from '@/columns/columns.service.js';
import { InjectModel, InjectPrismaClient } from '@/core/decorators/inject-prisma-client.decorator';
import type { Model } from '@/prisma/prisma.types';
import type { ProjectDatasetDto } from '@/projects/zod/projects.js';
import { TabularDataService } from '@/tabular-data/tabular-data.service.js';
import { UsersService } from '@/users/users.service.js';
import type { DataFrame } from '@/vendor/nodejs-polars.js';
import { pl } from '@/vendor/nodejs-polars.js';

import type { CreateTabularDatasetDto } from './zod/dataset.js';

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
    if (!dataset) {
      throw new ForbiddenException(`The current user is not allowed to modify the dataset with id ${datasetId}`);
    }
    return await this.tabularDataService.changeTabularColumnsMetadataPermission(datasetId, permissionLevel);
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

    if (createTabularDatasetDto.isJSON) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      df = pl.readJSON(JSON.stringify(JSON.parse(csvString).data));
    } else {
      df = pl.readCSV(csvString, { tryParseDates: true });
    }

    const dataset = await this.datasetModel.create({
      data: {
        datasetType: 'TABULAR',
        description: createTabularDatasetDto.description,
        isReadyToShare: false,
        managerIds: [managerId],
        name: createTabularDatasetDto.name,
        permission: 'MANAGER'
      }
    });

    await this.tabularDataService.create(df, dataset.id, createTabularDatasetDto.primaryKeys);

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

    if (currentUserId in dataset.managerIds) {
      return dataset;
    }

    const tabularDataView = await this.tabularDataService.getViewById(projectDatasetDto);
    dataset.tabularData = tabularDataView;
    return dataset;
  }

  async getPublic() {
    const publicDatasets = await this.datasetModel.findMany({
      where: {
        isReadyToShare: true,
        permission: 'PUBLIC'
      }
    });

    const resDatasetsInfo: DatasetCardProps[] = [];
    publicDatasets.forEach((publicDataset) => {
      resDatasetsInfo.push({
        createdAt: publicDataset.createdAt,
        datasetType: publicDataset.datasetType,
        description: publicDataset.description,
        id: publicDataset.id,
        isManager: false,
        license: publicDataset.license,
        managerIds: publicDataset.managerIds,
        name: publicDataset.name,
        updatedAt: publicDataset.updatedAt
      });
    });
    return resDatasetsInfo;
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
}

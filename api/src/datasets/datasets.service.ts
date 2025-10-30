import fs from 'fs';
import crypto from 'node:crypto';
import path from 'node:path';

import {
  $ColumnType,
  $CreateDataset,
  $DatasetStatus,
  $DatasetViewPagination,
  $EditDatasetInfo,
  $ProjectColumnSummary,
  $ProjectDataset,
  $TabularColumnSummary,
  $TabularDataDownloadFormat,
  $TabularDatasetView
} from '@databank/core';
import type { $DatasetCardProps, $DatasetInfo, $TabularDataset } from '@databank/core';
import type { Model } from '@douglasneuroinformatics/libnest';
import { ConfigService, InjectModel, InjectPrismaClient } from '@douglasneuroinformatics/libnest';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { PermissionLevel, PrismaClient } from '@prisma/client';
import type { Prisma, TabularColumn } from '@prisma/client';
import { Queue } from 'bullmq';

import { ColumnsService } from '@/columns/columns.service.js';
import { TabularDataService } from '@/tabular-data/tabular-data.service.js';
import { UsersService } from '@/users/users.service.js';

import { FileUploadQueueName } from './datasets.constants.js';

@Injectable()
export class DatasetsService {
  private readonly uploadsDir: string;

  constructor(
    @InjectModel('Dataset') private datasetModel: Model<'Dataset'>,
    @InjectPrismaClient() private prisma: PrismaClient,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly columnService: ColumnsService,
    private readonly tabularDataService: TabularDataService,
    @InjectQueue(FileUploadQueueName) private fileUploadQueue: Queue
  ) {
    this.uploadsDir = this.configService.get('UPLOADS_DIR') ?? path.resolve(process.cwd(), 'uploads');
  }

  async addManager(datasetId: string, managerId: string, managerEmailToAdd: string) {
    const dataset = await this.canModifyDataset(datasetId, managerId);

    const managerToAdd = await this.usersService.findByEmail(managerEmailToAdd);
    if (!managerToAdd) {
      throw new NotFoundException(`Cannot find user with email ${managerEmailToAdd}`);
    }

    if (dataset.managerIds.includes(managerToAdd.id)) {
      throw new UnprocessableEntityException(
        `User with email ${managerEmailToAdd} is already a manager of the dataset`
      );
    }

    const newDatasetIds = managerToAdd.datasetIds;
    newDatasetIds.push(datasetId);

    const updateNewManagerDatasetsIds = this.usersService.updateUser(managerToAdd.id, {
      datasetIds: newDatasetIds
    });

    const newManagerIds = dataset.managerIds;
    newManagerIds.push(managerToAdd.id);

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
    if (!dataset.managerIds.includes(currentUserId)) {
      throw new UnprocessableEntityException('Only managers can modify this dataset!');
    }
    return dataset;
  }

  async changeColumnDataPermission(
    datasetId: string,
    columnId: string,
    userId: string,
    newPermissionLevel: PermissionLevel
  ) {
    const dataset = await this.canModifyDataset(datasetId, userId);

    if (!dataset.tabularData) {
      throw new NotFoundException(`There is not tabular data in this dataset with id ${datasetId}`);
    }

    return this.columnService.changeColumnDataPermission(columnId, newPermissionLevel);
  }

  async changeColumnMetadataPermission(
    datasetId: string,
    columnId: string,
    userId: string,
    newPermissionLevel: PermissionLevel
  ) {
    const dataset = await this.canModifyDataset(datasetId, userId);

    if (!dataset.tabularData) {
      throw new NotFoundException(`There is not tabular data in this dataset with id ${datasetId}`);
    }

    return this.columnService.changeColumnMetadataPermission(columnId, newPermissionLevel);
  }

  // async changeDatasetDataPermission(datasetId: string, currentUserId: string, permissionLevel: PermissionLevel) {
  //   const dataset = await this.canModifyDataset(datasetId, currentUserId);

  //   if (!dataset.tabularData) {
  //     throw new NotFoundException(`There is not tabular data in this dataset with id ${datasetId}`);
  //   }

  //   return await this.columnService.updateMany(dataset.tabularData.id, {
  //     dataPermission: { permission: permissionLevel }
  //   });
  // }

  // async changeDatasetMetadataPermission(datasetId: string, currentUserId: string, permissionLevel: PermissionLevel) {
  //   const dataset = await this.canModifyDataset(datasetId, currentUserId);
  //   if (!dataset) {
  //     throw new UnprocessableEntityException(`The current user is not allowed to modify the dataset with id ${datasetId}`);
  //   }
  //   return await this.tabularDataService.changeTabularColumnsMetadataPermission(datasetId, permissionLevel);
  // }

  async createDataset(createTabularDatasetDto: $CreateDataset, file: Express.Multer.File | string, managerId: string) {
    const currUser = await this.usersService.findById(managerId);
    if (!currUser.datasetIds) {
      throw new NotFoundException('User Not Found or datasetId field does not exist in this user!');
    }
    const datasetIdArr = currUser.datasetIds;

    // create base dataset without file
    if (!file) {
      const baseDataset = await this.datasetModel.create({
        data: {
          datasetType: 'BASE',
          description: createTabularDatasetDto.description,
          isReadyToShare: false,
          license: createTabularDatasetDto.license,
          managerIds: [managerId],
          name: createTabularDatasetDto.name,
          permission: 'MANAGER',
          status: 'Success'
        }
      });

      datasetIdArr.push(baseDataset.id);

      await this.usersService.updateUser(managerId, {
        datasetIds: datasetIdArr
      });
      return baseDataset;
    }

    // Add a job to the file-upload queue
    let dataset;
    const primaryKeysArray = createTabularDatasetDto.primaryKeys
      ? Array.isArray(createTabularDatasetDto.primaryKeys)
        ? createTabularDatasetDto.primaryKeys
        : [createTabularDatasetDto.primaryKeys]
      : [];
    if (typeof file !== 'string') {
      // Resolve once from configuration or env
      await fs.promises.mkdir(this.uploadsDir, { recursive: true });
      // Generate a collision-free, sanitised filename
      const safeName = crypto.randomUUID() + path.extname(file.originalname);
      const filePath = path.join(this.uploadsDir, safeName);
      await fs.promises.writeFile(filePath, file.buffer);
      dataset = await this.datasetModel.create({
        data: {
          datasetType: createTabularDatasetDto.datasetType,
          description: createTabularDatasetDto.description,
          isReadyToShare:
            typeof createTabularDatasetDto.isReadyToShare === 'string'
              ? createTabularDatasetDto.isReadyToShare.toLowerCase() === 'true'
              : Boolean(createTabularDatasetDto.isReadyToShare),
          license: createTabularDatasetDto.license,
          managerIds: [managerId],
          name: createTabularDatasetDto.name,
          permission: createTabularDatasetDto.permission,
          status: 'Processing'
        }
      });
      await this.fileUploadQueue.add('handle-file-upload', {
        datasetId: dataset.id,
        filePath,
        isJSON:
          typeof createTabularDatasetDto.isJSON === 'string'
            ? createTabularDatasetDto.isJSON.toLowerCase() === 'true'
            : Boolean(createTabularDatasetDto.isJSON),
        primaryKeys: primaryKeysArray
      });
    } else {
      dataset = await this.datasetModel.create({
        data: {
          datasetType: createTabularDatasetDto.datasetType,
          description: createTabularDatasetDto.description,
          isReadyToShare:
            typeof createTabularDatasetDto.isReadyToShare === 'string'
              ? createTabularDatasetDto.isReadyToShare.toLowerCase() === 'true'
              : Boolean(createTabularDatasetDto.isReadyToShare),
          license: createTabularDatasetDto.license,
          managerIds: [managerId],
          name: createTabularDatasetDto.name,
          permission: createTabularDatasetDto.permission,
          status: 'Processing'
        }
      });
      await this.fileUploadQueue.add('handle-string-upload', {
        datasetId: dataset.id,
        isJSON:
          typeof createTabularDatasetDto.isJSON === 'string'
            ? createTabularDatasetDto.isJSON.toLowerCase() === 'true'
            : Boolean(createTabularDatasetDto.isJSON),
        primaryKeys: primaryKeysArray,
        uploadedString: file
      });
    }

    datasetIdArr.push(dataset.id);

    await this.usersService.updateUser(managerId, {
      datasetIds: datasetIdArr
    });

    return dataset;
  }

  async deleteColumnById(datasetId: string, columnId: string, userId: string) {
    const dataset = await this.canModifyDataset(datasetId, userId);

    if (!dataset.tabularData) {
      throw new NotFoundException(`There is not tabular data in this dataset with id ${datasetId}`);
    }

    return await this.tabularDataService.deleteColumnById(dataset.tabularData.id, columnId);
  }

  async deleteDataset(datasetId: string, currentUserId: string) {
    const dataset = await this.canModifyDataset(datasetId, currentUserId);

    const deleteTargetDataset = this.datasetModel.delete({
      where: {
        id: dataset.id
      }
    });

    // update all managers of this dataset
    const managersToUpdate = await this.usersService.findManyByDatasetId(dataset.id);

    const updateManagers = [];

    for (const manager of managersToUpdate) {
      const newDatasetId = manager.datasetIds.filter((val) => val !== dataset.id);
      updateManagers.push(
        this.usersService.updateUser(manager.id, {
          datasetIds: newDatasetId
        })
      );
    }

    if (dataset.datasetType === 'TABULAR' && dataset.tabularData) {
      const deleteColumns = this.columnService.deleteByTabularDataId(dataset.tabularData.id);
      const deleteTabularData = this.tabularDataService.deleteById(dataset.tabularData.id);
      return await this.prisma.$transaction([deleteColumns, deleteTabularData, ...updateManagers, deleteTargetDataset]);
    }

    return await this.prisma.$transaction([...updateManagers, deleteTargetDataset]);
  }

  async downloadDataById(datasetId: string, currentUserId: string, format: $TabularDataDownloadFormat) {
    const userStatus = await this.getUserStatusById(currentUserId, datasetId);

    const dataset = await this.datasetModel.findUnique({
      include: {
        tabularData: {
          include: {
            columns: true
          }
        }
      },
      where: {
        id: datasetId
      }
    });

    if (!dataset) {
      throw new NotFoundException();
    }

    if (!dataset.tabularData?.id) {
      throw new NotFoundException('No such tabular data available!');
    }

    const colNumber = dataset.tabularData.columns.length;

    if (!dataset.tabularData.columns[0]?.id) {
      throw new NotFoundException('No columns found!');
    }
    const rowNumber = await this.columnService.getLengthById(dataset.tabularData.columns[0].id);

    const datasetView = await this.tabularDataService.getViewById(
      dataset.tabularData.id,
      userStatus,
      {
        currentPage: 1,
        itemsPerPage: rowNumber
      },
      {
        currentPage: 1,
        itemsPerPage: colNumber
      }
    );

    return this.formatDataDownloadString(format, datasetView);
  }

  async downloadMetadataById(datasetId: string, currentUserId: string, format: $TabularDataDownloadFormat) {
    const userStatus = await this.getUserStatusById(currentUserId, datasetId);

    const dataset = await this.datasetModel.findUnique({
      include: {
        tabularData: {
          include: {
            columns: true
          }
        }
      },
      where: {
        id: datasetId
      }
    });

    if (!dataset) {
      throw new NotFoundException();
    }

    if (!dataset.tabularData?.id) {
      throw new NotFoundException('No such tabular data available!');
    }

    const colNumber = dataset.tabularData.columns.length;

    if (!dataset.tabularData.columns[0]?.id) {
      throw new NotFoundException('No columns found!');
    }
    const rowNumber = await this.columnService.getLengthById(dataset.tabularData.columns[0].id);

    const datasetView = await this.tabularDataService.getViewById(
      dataset.tabularData.id,
      userStatus,
      {
        currentPage: 1,
        itemsPerPage: rowNumber
      },
      {
        currentPage: 1,
        itemsPerPage: colNumber
      }
    );

    return this.formatMetadataDownloadString(format, datasetView);
  }

  async downloadPublicDataById(datasetId: string, format: $TabularDataDownloadFormat) {
    const dataset = await this.datasetModel.findUnique({
      include: {
        tabularData: {
          include: {
            columns: true
          }
        }
      },
      where: {
        id: datasetId
      }
    });

    if (!dataset || dataset.permission !== 'PUBLIC') {
      throw new NotFoundException('No such public dataset is found!');
    }

    if (!dataset.tabularData?.id) {
      throw new NotFoundException('No such tabular data available!');
    }

    const colNumber = dataset.tabularData.columns.length;

    if (!dataset.tabularData.columns[0]?.id) {
      throw new NotFoundException('No columns found!');
    }
    const rowNumber = await this.columnService.getLengthById(dataset.tabularData.columns[0].id);

    const datasetView = await this.tabularDataService.getViewById(
      dataset.tabularData.id,
      'PUBLIC',
      {
        currentPage: 1,
        itemsPerPage: rowNumber
      },
      {
        currentPage: 1,
        itemsPerPage: colNumber
      }
    );

    return this.formatDataDownloadString(format, datasetView);
  }

  async downloadPublicMetadataById(datasetId: string, format: $TabularDataDownloadFormat) {
    const dataset = await this.datasetModel.findUnique({
      include: {
        tabularData: {
          include: {
            columns: true
          }
        }
      },
      where: {
        id: datasetId
      }
    });

    if (!dataset) {
      throw new NotFoundException();
    }

    if (!dataset.tabularData?.id) {
      throw new NotFoundException('No such tabular data available!');
    }

    const colNumber = dataset.tabularData.columns.length;

    if (!dataset.tabularData.columns[0]?.id) {
      throw new NotFoundException('No columns found!');
    }
    const rowNumber = await this.columnService.getLengthById(dataset.tabularData.columns[0].id);

    const datasetView = await this.tabularDataService.getViewById(
      dataset.tabularData.id,
      'PUBLIC',
      {
        currentPage: 1,
        itemsPerPage: rowNumber
      },
      {
        currentPage: 1,
        itemsPerPage: colNumber
      }
    );

    return this.formatMetadataDownloadString(format, datasetView);
  }

  async editDatasetInfo(datasetId: string, managerId: string, editDatasetInfoDto: $EditDatasetInfo) {
    const dataset = await this.canModifyDataset(datasetId, managerId);

    return await this.datasetModel.update({
      data: editDatasetInfoDto,
      where: { id: dataset.id }
    });
  }

  formatMetadataDownloadString(format: $TabularDataDownloadFormat, datasetView: $TabularDatasetView) {
    const delimiter = format === 'CSV' ? ',' : '\t';

    const metaDataHeader = [
      'column_name',
      'column_type',
      'column_data_permission',
      'column_metadata_permission',
      'nullable',
      'count',
      'nullCount',
      'max',
      'min',
      'mean',
      'median',
      'mode',
      'std',
      'distribution'
    ];

    let metadataRowsString = metaDataHeader.join(delimiter) + '\n';
    for (const [columnName, metadata] of Object.entries(datasetView.metadata)) {
      metadataRowsString += this.formatMetadataBodyString(delimiter, columnName, metadata);
    }
    return metadataRowsString;
  }

  async getAllByManagerId(currentUserId: string) {
    return await this.datasetModel.findMany({
      where: {
        managerIds: {
          has: currentUserId
        },
        status: 'Success'
      }
    });
  }

  async getAvailable(currentUserId: string): Promise<$DatasetInfo[]> {
    const currentUser = await this.usersService.findById(currentUserId);

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

    if (!currentUser.verifiedAt) {
      return availableDatasets.filter((dataset) => {
        return (
          dataset.managerIds.includes(currentUserId) || dataset.permission == 'LOGIN' || dataset.permission == 'PUBLIC'
        );
      });
    }

    const filtered = availableDatasets.filter(
      (dataset) => dataset.managerIds.includes(currentUserId) || dataset.permission !== 'MANAGER'
    );
    return filtered;
  }

  async getById(datasetId: string) {
    const dataset = await this.datasetModel.findUnique({
      where: {
        id: datasetId
      }
    });

    return dataset;
  }

  async getColumnLengthById(columnId: string) {
    return await this.columnService.getLengthById(columnId);
  }

  async getColumnsById(datasetId: string, currentUserId: string) {
    const dataset = await this.datasetModel.findUnique({
      include: {
        tabularData: {
          include: {
            columns: {
              select: {
                dataPermission: true,
                id: true,
                kind: true,
                name: true,
                nullable: true,
                summary: true,
                summaryPermission: true
              }
            }
          }
        }
      },
      where: {
        id: datasetId,
        managerIds: {
          has: currentUserId
        }
      }
    });

    if (!dataset?.tabularData?.columns) {
      throw new NotFoundException(`No colums are found with dataset ID ${datasetId}`);
    }

    const projectColumn: $TabularColumnSummary[] = [];
    dataset.tabularData.columns.forEach((column) => {
      const currProjectColumn = this.formatProjectColumn(column);
      projectColumn.push(currProjectColumn);
    });
    return projectColumn;
  }

  async getDatasetStatus(datasetId: string) {
    const dataset = await this.datasetModel.findUnique({
      select: {
        status: true
      },
      where: {
        id: datasetId
      }
    });
    if (!dataset) {
      throw new NotFoundException('Dataset cannot be found!');
    } else if (!dataset.status) {
      throw new NotFoundException('Dataset status does not exist!');
    }

    return dataset.status as string;
  }

  async getOnePublicById(
    datasetId: string,
    rowPaginationDto: $DatasetViewPagination,
    columnPaginationDto: $DatasetViewPagination
  ): Promise<$DatasetInfo | $TabularDataset> {
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
    if (dataset.permission !== 'PUBLIC') {
      throw new UnprocessableEntityException('The dataset is not public!');
    }

    if (!dataset.tabularData?.id) {
      return {
        createdAt: dataset.createdAt,
        datasetType: dataset.datasetType,
        description: dataset.description,
        id: dataset.id,
        isReadyToShare: dataset.isReadyToShare,
        license: dataset.license,
        managerIds: dataset.managerIds,
        name: dataset.name,
        permission: dataset.permission,
        status: dataset.status,
        updatedAt: dataset.updatedAt
      };
    }
    const datasetView = await this.tabularDataService.getViewById(
      dataset.tabularData.id,
      'PUBLIC',
      rowPaginationDto,
      columnPaginationDto
    );
    // the frontend search function should allow the user to fill a form
    // according to the form data (filter constrains), the backend should find
    // rows and columns

    return {
      createdAt: dataset.createdAt,
      datasetType: dataset.datasetType,
      description: dataset.description,
      id: dataset.id,
      isReadyToShare: dataset.isReadyToShare,
      license: dataset.license,
      managerIds: dataset.managerIds,
      name: dataset.name,
      permission: dataset.permission,
      status: dataset.status,
      updatedAt: dataset.updatedAt,
      ...datasetView
    };
  }

  async getProjectDatasetViewById(
    projectDataset: $ProjectDataset,
    rowPagination: $DatasetViewPagination,
    columnPagination: $DatasetViewPagination
  ) {
    const dataset = await this.datasetModel.findUnique({
      include: {
        tabularData: true
      },
      where: {
        id: projectDataset.datasetId
      }
    });

    if (!dataset) {
      throw new NotFoundException('Dataset not found!');
    }

    if (!dataset.tabularData?.id) {
      throw new NotFoundException('No such tabular data available!');
    }
    const datasetView = await this.tabularDataService.getProjectDatasetView(
      projectDataset,
      rowPagination,
      columnPagination
    );

    return {
      createdAt: dataset.createdAt,
      datasetType: dataset.datasetType,
      description: dataset.description,
      isReadyToShare: dataset.isReadyToShare,
      license: dataset.license,
      managerIds: dataset.managerIds,
      name: dataset.name,
      permission: dataset.permission,
      updatedAt: dataset.updatedAt,
      ...datasetView
    };
  }

  async getPublic() {
    const publicDatasets = await this.datasetModel.findMany({
      where: {
        isReadyToShare: true,
        permission: 'PUBLIC'
      }
    });

    const resDatasetsInfo: $DatasetCardProps[] = [];
    publicDatasets.forEach((publicDataset) => {
      resDatasetsInfo.push({
        createdAt: publicDataset.createdAt,
        datasetType: publicDataset.datasetType,
        description: publicDataset.description,
        id: publicDataset.id,
        isManager: false,
        isPublic: true,
        isReadyToShare: publicDataset.isReadyToShare,
        license: publicDataset.license,
        managerIds: publicDataset.managerIds,
        name: publicDataset.name,
        permission: publicDataset.permission,
        status: publicDataset.status,
        updatedAt: publicDataset.updatedAt
      });
    });
    return resDatasetsInfo;
  }

  async getUserStatusById(userId: string, datasetId: string): Promise<PermissionLevel> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User Not Found!');
    }

    const dataset = await this.datasetModel.findUnique({ where: { id: datasetId } });
    if (!dataset) {
      throw new NotFoundException('Dataset Not Found!');
    }

    if (dataset.managerIds.includes(userId)) {
      return 'MANAGER';
    } else if (user.verifiedAt) {
      return 'VERIFIED';
    } else if (user.confirmedAt) {
      return 'LOGIN';
    } else {
      throw new UnprocessableEntityException('Unexpected User Status!');
    }
  }

  async getViewById(
    datasetId: string,
    currentUserId: string,
    rowPaginationDto: $DatasetViewPagination,
    columnPaginationDto: $DatasetViewPagination
  ): Promise<$DatasetInfo | $TabularDataset> {
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

    const currUser = await this.usersService.findById(currentUserId);
    let userStatus: PermissionLevel;
    if (dataset.managerIds.includes(currentUserId)) {
      userStatus = 'MANAGER';
    } else if (currUser.verifiedAt) {
      userStatus = 'VERIFIED';
    } else if (currUser.confirmedAt) {
      userStatus = 'LOGIN';
    } else {
      throw new UnprocessableEntityException('Unexpected user status!');
    }

    if (!dataset.isReadyToShare && !dataset.managerIds.includes(currentUserId)) {
      throw new UnprocessableEntityException('The dataset is not ready for share!');
    }

    let datasetView: $TabularDatasetView;
    const emptyDatasetView = {
      columnIds: {},
      columns: [],
      metadata: {},
      primaryKeys: [],
      rows: [],
      totalNumberOfColumns: 0,
      totalNumberOfRows: 0
    };

    if (!dataset.tabularData?.id) {
      return {
        createdAt: dataset.createdAt,
        datasetType: dataset.datasetType,
        description: dataset.description,
        id: dataset.id,
        isReadyToShare: dataset.isReadyToShare,
        license: dataset.license,
        managerIds: dataset.managerIds,
        name: dataset.name,
        permission: dataset.permission,
        status: dataset.status,
        updatedAt: dataset.updatedAt,
        ...emptyDatasetView
      };
    }

    // the frontend search function should allow the user to fill a form
    // according to the form data (filter constrains), the backend should find
    // rows and columns

    if (userStatus === 'MANAGER') {
      datasetView = await this.tabularDataService.getViewById(
        dataset.tabularData.id,
        userStatus,
        rowPaginationDto,
        columnPaginationDto
      );
    } else if (dataset.permission === 'MANAGER') {
      datasetView = emptyDatasetView;
    } else if (dataset.permission === 'VERIFIED' && userStatus !== 'VERIFIED') {
      datasetView = emptyDatasetView;
    } else {
      datasetView = await this.tabularDataService.getViewById(
        dataset.tabularData.id,
        userStatus,
        rowPaginationDto,
        columnPaginationDto
      );
    }

    return {
      createdAt: dataset.createdAt,
      datasetType: dataset.datasetType,
      description: dataset.description,
      id: dataset.id,
      isReadyToShare: dataset.isReadyToShare,
      license: dataset.license,
      managerIds: dataset.managerIds,
      name: dataset.name,
      permission: dataset.permission,
      status: dataset.status,
      updatedAt: dataset.updatedAt,
      ...datasetView
    };
  }

  async mutateColumnType(datasetId: string, columnId: string, userId: string, columnType: $ColumnType) {
    const dataset = await this.canModifyDataset(datasetId, userId);

    if (!dataset.tabularData) {
      throw new NotFoundException(`There is no tabular data in this dataset with id ${datasetId}`);
    }

    return await this.columnService.mutateColumnType(columnId, columnType);
  }

  async removeManager(datasetId: string, managerId: string, managerIdToRemove: string) {
    const dataset = await this.canModifyDataset(datasetId, managerId);

    const managerToRemove = await this.usersService.findById(managerIdToRemove);

    if (!managerToRemove) {
      throw new NotFoundException(`Manager with id ${managerIdToRemove} is not found!`);
    }

    const newManagerIds = dataset.managerIds.filter((val) => val !== managerIdToRemove);

    const updateDatasetManagerIds = this.datasetModel.update({
      data: {
        managerIds: newManagerIds
      },
      where: {
        id: datasetId
      }
    });

    const newDatasetIds = managerToRemove.datasetIds.filter((val) => val !== datasetId);

    const updateManagerToRemoveDatasetIds = this.usersService.updateUser(managerIdToRemove, {
      datasetIds: newDatasetIds
    });

    return await this.prisma.$transaction([updateDatasetManagerIds, updateManagerToRemoveDatasetIds]);
  }

  async setReadyToShare(datasetId: string, currentUserId: string) {
    const dataset = await this.canModifyDataset(datasetId, currentUserId);
    if (dataset.isReadyToShare) {
      throw new UnprocessableEntityException('This dataset is not found or is already set to ready to share!');
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

  async toggleColumnNullable(datasetId: string, columnId: string, userId: string) {
    const dataset = await this.canModifyDataset(datasetId, userId);

    if (!dataset.tabularData) {
      throw new NotFoundException(`There is not tabular data in this dataset with id ${datasetId}`);
    }

    return this.columnService.toggleColumnNullable(columnId);
  }

  async updateDatasetStatus(datasetId: string, status: $DatasetStatus) {
    return await this.datasetModel.update({
      data: {
        status: status
      },
      where: {
        id: datasetId
      }
    });
  }

  private formatDataDownloadString(format: $TabularDataDownloadFormat, datasetView: $TabularDatasetView) {
    const delimiter = format === 'CSV' ? ',' : '\t';
    let resultString = datasetView.columns.join(delimiter) + '\n';
    for (const row of datasetView.rows) {
      resultString += Object.values(row).join(delimiter) + '\n';
    }

    return resultString;
  }

  private formatMetadataBodyString(delimiter: ',' | '\t', columnName: string, datasetMetadata: $TabularColumnSummary) {
    const metadata_row = [];
    switch (datasetMetadata.kind) {
      case 'DATETIME':
        metadata_row.push(
          ...[
            columnName,
            datasetMetadata.kind,
            datasetMetadata.dataPermission,
            datasetMetadata.metadataPermission,
            datasetMetadata.nullable,
            datasetMetadata.count,
            datasetMetadata.nullCount,
            datasetMetadata.datetimeSummary.max,
            datasetMetadata.datetimeSummary.min,
            '',
            '',
            '',
            '',
            ''
          ]
        );
        break;
      case 'ENUM': {
        const enumSummaryObj: { [key: string]: number } = {};
        datasetMetadata.enumSummary.distribution.forEach((entry) => {
          enumSummaryObj[entry['']] = entry.count;
        });
        metadata_row.push(
          ...[
            columnName,
            datasetMetadata.kind,
            datasetMetadata.dataPermission,
            datasetMetadata.metadataPermission,
            datasetMetadata.nullable,
            datasetMetadata.count,
            datasetMetadata.nullCount,
            '',
            '',
            '',
            '',
            '',
            '',
            JSON.stringify(enumSummaryObj)
          ]
        );
        break;
      }
      case 'FLOAT':
        metadata_row.push(
          ...[
            columnName,
            datasetMetadata.kind,
            datasetMetadata.dataPermission,
            datasetMetadata.metadataPermission,
            datasetMetadata.nullable,
            datasetMetadata.count,
            datasetMetadata.nullCount,
            datasetMetadata.floatSummary.max,
            datasetMetadata.floatSummary.min,
            datasetMetadata.floatSummary.mean,
            datasetMetadata.floatSummary.median,
            '',
            datasetMetadata.floatSummary.std,
            ''
          ]
        );
        break;
      case 'INT':
        metadata_row.push(
          ...[
            columnName,
            datasetMetadata.kind,
            datasetMetadata.dataPermission,
            datasetMetadata.metadataPermission,
            datasetMetadata.nullable,
            datasetMetadata.count,
            datasetMetadata.nullCount,
            datasetMetadata.intSummary ? datasetMetadata.intSummary.max : 'No Permission',
            datasetMetadata.intSummary ? datasetMetadata.intSummary.min : 'No Permission',
            datasetMetadata.intSummary ? datasetMetadata.intSummary.mean : 'No Permission',
            datasetMetadata.intSummary ? datasetMetadata.intSummary.median : 'No Permission',
            datasetMetadata.intSummary ? datasetMetadata.intSummary.mode : 'No Permission',
            datasetMetadata.intSummary ? datasetMetadata.intSummary.std : 'No Permission',
            ''
          ]
        );
        break;

      case 'STRING':
        metadata_row.push(
          ...[
            columnName,
            datasetMetadata.kind,
            datasetMetadata.dataPermission,
            datasetMetadata.metadataPermission,
            datasetMetadata.nullable,
            datasetMetadata.count,
            datasetMetadata.nullCount,
            '',
            '',
            '',
            '',
            '',
            '',
            ''
          ]
        );
    }
    return metadata_row.join(delimiter) + '\n';
  }

  private formatProjectColumn(
    column: Pick<
      TabularColumn,
      'dataPermission' | 'id' | 'kind' | 'name' | 'nullable' | 'summary' | 'summaryPermission'
    >
  ): $ProjectColumnSummary {
    switch (column.kind) {
      case 'DATETIME':
        return {
          count: column.summary.count,
          dataPermission: column.dataPermission,
          datetimeSummary: column.summary.datetimeSummary!,
          id: column.id,
          kind: 'DATETIME',
          metadataPermission: column.summaryPermission,
          name: column.name,
          nullable: column.nullable,
          nullCount: column.summary.nullCount
        };
      case 'ENUM': {
        // enumSummary.distribution is an array of objects: [{"": "EnumOption", "count": integer}, ...]
        const distributionObj: { [key: string]: number } = {};
        (column.summary.enumSummary?.distribution as Prisma.JsonArray as { '': string; count: number }[]).forEach(
          (entry) => {
            distributionObj[entry['']] = entry.count;
          }
        );
        return {
          count: column.summary.count,
          dataPermission: column.dataPermission,
          enumSummary: {
            distribution: column.summary.enumSummary?.distribution as Prisma.JsonArray as {
              '': string;
              count: number;
            }[]
          },
          id: column.id,
          kind: 'ENUM',
          metadataPermission: column.summaryPermission,
          name: column.name,
          nullable: column.nullable,
          nullCount: column.summary.nullCount
        };
      }
      case 'FLOAT':
        return {
          count: column.summary.count,
          dataPermission: column.dataPermission,
          floatSummary: column.summary.floatSummary!,
          id: column.id,
          kind: 'FLOAT',
          metadataPermission: column.summaryPermission,
          name: column.name,
          nullable: column.nullable,
          nullCount: column.summary.nullCount
        };
      case 'INT':
        return {
          count: column.summary.count,
          dataPermission: column.dataPermission,
          id: column.id,
          intSummary: column.summary.intSummary!,
          kind: 'INT',
          metadataPermission: column.summaryPermission,
          name: column.name,
          nullable: column.nullable,
          nullCount: column.summary.nullCount
        };
      case 'STRING':
        return {
          count: column.summary.count,
          dataPermission: column.dataPermission,
          id: column.id,
          kind: 'STRING',
          metadataPermission: column.summaryPermission,
          name: column.name,
          nullable: column.nullable,
          nullCount: column.summary.nullCount
        };
      default:
        throw new UnprocessableEntityException('Unexpected Column Type');
    }
  }
}

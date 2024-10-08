import type {
  AddProjectDatasetColumns,
  ColumnDataType,
  DatasetCardProps,
  DatasetViewPaginationDto,
  EditDatasetInfoDto,
  ProjectDatasetDto,
  TabularDatasetView
} from '@databank/types';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PermissionLevel, PrismaClient } from '@prisma/client';

import { ColumnsService } from '@/columns/columns.service.js';
import { InjectModel, InjectPrismaClient } from '@/core/decorators/inject-prisma-client.decorator';
import type { Model } from '@/prisma/prisma.types';
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

  async addManager(datasetId: string, managerId: string, managerEmailToAdd: string) {
    const dataset = await this.canModifyDataset(datasetId, managerId);

    const managerToAdd = await this.usersService.findByEmail(managerEmailToAdd);
    if (!managerToAdd) {
      throw new NotFoundException(`Cannot find user with email ${managerEmailToAdd}`);
    }

    if (dataset.managerIds.includes(managerToAdd.id)) {
      throw new ForbiddenException(`User with email ${managerEmailToAdd} is already a manager of the dataset`);
    }

    const newDatasetIds = managerToAdd.datasetId;
    newDatasetIds.push(datasetId);

    const updateNewManagerDatasetsIds = this.usersService.updateUser(managerToAdd.id, {
      datasetId: newDatasetIds
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
      throw new ForbiddenException('Only managers can modify this dataset!');
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
    const currUser = await this.usersService.findById(managerId);
    if (!currUser.datasetId) {
      throw new NotFoundException('User Not Found!');
    }
    let datasetIdArr = currUser.datasetId;

    // create base dataset without file
    if (!file) {
      const baseDataset = await this.datasetModel.create({
        data: {
          datasetType: 'BASE',
          description: createTabularDatasetDto.description,
          isReadyToShare: false,
          managerIds: [managerId],
          name: createTabularDatasetDto.name,
          permission: 'MANAGER'
        }
      });

      datasetIdArr.push(baseDataset.id);

      await this.usersService.updateUser(managerId, {
        datasetId: datasetIdArr
      });
      return baseDataset;
    }

    let csvString: string;
    let df: DataFrame;
    let separator = ',';

    if (typeof file === 'string') {
      csvString = file;
    } else {
      // file received through the network is stored in memory buffer which is converted to a string
      separator = file.originalname.endsWith('.tsv') ? '\t' : ',';
      csvString = file.buffer.toString(); // polars has a bug parsing tsv, this is a hack for it to work
    }

    if (createTabularDatasetDto.isJSON.toLowerCase() === 'true') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      df = pl.readJSON(JSON.stringify(JSON.parse(csvString).data));
    } else {
      df = pl.readCSV(csvString, { quoteChar: '"', sep: separator, tryParseDates: true });
      // df = pl.readJSON(JSON.stringify(typedObjs));
    }

    const dataset = await this.datasetModel.create({
      data: {
        datasetType: createTabularDatasetDto.datasetType,
        description: createTabularDatasetDto.description,
        isReadyToShare: createTabularDatasetDto.isReadyToShare.toLowerCase() === 'true',
        managerIds: [managerId],
        name: createTabularDatasetDto.name,
        permission: createTabularDatasetDto.permission
      }
    });
    try {
      // prepare the primary keys array
      if (createTabularDatasetDto.primaryKeys) {
        const primaryKeysArray = createTabularDatasetDto.primaryKeys.split(',');
        primaryKeysArray.map((primaryKey) => {
          primaryKey.trim();
        });
        await this.tabularDataService.create(df, dataset.id, primaryKeysArray);
      } else {
        await this.tabularDataService.create(df, dataset.id, []);
      }
    } catch {
      await this.datasetModel.delete({
        where: {
          id: dataset.id
        }
      });
      throw new ForbiddenException('Cannot create dataset!');
    }

    datasetIdArr.push(dataset.id);

    await this.usersService.updateUser(managerId, {
      datasetId: datasetIdArr
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

    let deleteTargetDataset = this.datasetModel.delete({
      where: {
        id: dataset.id
      }
    });

    // update all managers of this dataset
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

    if (dataset.datasetType === 'TABULAR') {
      if (!dataset.tabularData) {
        throw new NotFoundException(`There is not tabular data in this dataset with id ${datasetId}`);
      }
      const deleteColumns = this.columnService.deleteByTabularDataId(dataset.tabularData.id);
      const deleteTabularData = this.tabularDataService.deleteById(dataset.tabularData.id);
      return await this.prisma.$transaction([deleteColumns, deleteTabularData, ...updateManagers, deleteTargetDataset]);
    }

    return await this.prisma.$transaction([...updateManagers, deleteTargetDataset]);
  }

  async downloadDataById(datasetId: string, currentUserId: string, format: 'CSV' | 'TSV') {
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

  async downloadMetadataById(datasetId: string, currentUserId: string, format: 'CSV' | 'TSV') {
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

  async downloadPublicDataById(datasetId: string, format: 'CSV' | 'TSV') {
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

  async downloadPublicMetadataById(datasetId: string, format: 'CSV' | 'TSV') {
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

  async editDatasetInfo(datasetId: string, managerId: string, editDatasetInfoDto: EditDatasetInfoDto) {
    const dataset = await this.canModifyDataset(datasetId, managerId);

    return await this.datasetModel.update({
      data: editDatasetInfoDto,
      where: { id: dataset.id }
    });
  }

  async getAllByManagerId(currentUserId: string) {
    return await this.datasetModel.findMany({
      where: {
        managerIds: {
          has: currentUserId
        }
      }
    });
  }

  async getAvailable(currentUserId: string) {
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
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        dataset.managerIds.includes(currentUserId) || dataset.permission == 'LOGIN' || dataset.permission == 'PUBLIC';
      });
    }

    availableDatasets.forEach((dataset) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      dataset.managerIds.includes(currentUserId) || dataset.permission !== 'MANAGER' ? dataset : null;
    });
    return availableDatasets;
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
            columns: true
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

    const columnsNamesAndIds: AddProjectDatasetColumns = {};
    dataset.tabularData.columns.forEach((column) => {
      columnsNamesAndIds[column.name] = column.id;
    });
    return columnsNamesAndIds;
  }

  async getOnePublicById(
    datasetId: string,
    rowPaginationDto: DatasetViewPaginationDto,
    columnPaginationDto: DatasetViewPaginationDto
  ) {
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
      throw new ForbiddenException('The dataset is not public!');
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
      updatedAt: dataset.updatedAt,
      ...datasetView
    };
  }

  async getProjectDatasetViewById(
    projectDatasetDto: ProjectDatasetDto,
    rowPagination: DatasetViewPaginationDto,
    columnPagination: DatasetViewPaginationDto
  ) {
    const dataset = await this.datasetModel.findUnique({
      include: {
        tabularData: true
      },
      where: {
        id: projectDatasetDto.datasetId
      }
    });

    if (!dataset) {
      throw new NotFoundException('Dataset not found!');
    }

    if (!dataset.tabularData?.id) {
      throw new NotFoundException('No such tabular data available!');
    }
    const datasetView = await this.tabularDataService.getProjectDatasetView(
      projectDatasetDto,
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

    const resDatasetsInfo: DatasetCardProps[] = [];
    publicDatasets.forEach((publicDataset) => {
      resDatasetsInfo.push({
        createdAt: publicDataset.createdAt,
        datasetType: publicDataset.datasetType,
        description: publicDataset.description,
        id: publicDataset.id,
        isManager: false,
        isReadyToShare: publicDataset.isReadyToShare,
        license: publicDataset.license,
        managerIds: publicDataset.managerIds,
        name: publicDataset.name,
        permission: publicDataset.permission,
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
      throw new ForbiddenException('Unexpected User Status!');
    }
  }

  async getViewById(
    datasetId: string,
    currentUserId: string,
    rowPaginationDto: DatasetViewPaginationDto,
    columnPaginationDto: DatasetViewPaginationDto
  ) {
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
      throw new ForbiddenException('Unexpected user status!');
    }

    if (!dataset.isReadyToShare && !dataset.managerIds.includes(currentUserId)) {
      throw new ForbiddenException('The dataset is not ready for share!');
    }

    let datasetView: TabularDatasetView;
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
      updatedAt: dataset.updatedAt,
      ...datasetView
    };
  }

  async mutateColumnType(datasetId: string, columnId: string, userId: string, columnType: ColumnDataType) {
    const dataset = await this.canModifyDataset(datasetId, userId);

    if (!dataset.tabularData) {
      throw new NotFoundException(`There is not tabular data in this dataset with id ${datasetId}`);
    }

    return await this.columnService.mutateColumnType(columnId, columnType);
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

  async toggleColumnNullable(datasetId: string, columnId: string, userId: string) {
    const dataset = await this.canModifyDataset(datasetId, userId);

    if (!dataset.tabularData) {
      throw new NotFoundException(`There is not tabular data in this dataset with id ${datasetId}`);
    }

    return this.columnService.toggleColumnNullable(columnId);
  }

  private formatDataDownloadString(format: 'CSV' | 'TSV', datasetView: TabularDatasetView) {
    const delimiter = format === 'CSV' ? ',' : '\t';
    let resultString = datasetView.columns.join(delimiter) + '\n';
    for (let row of datasetView.rows) {
      resultString += Object.values(row).join(delimiter) + '\n';
    }

    return resultString;
  }

  private formatMetadataDownloadString(format: 'CSV' | 'TSV', datasetView: TabularDatasetView) {
    const delimiter = format === 'CSV' ? ',' : '\t';

    const metaDataHeader = [
      'column_name',
      'column_type',
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
    for (let columnName of Object.keys(datasetView.metadata)) {
      metadataRowsString +=
        columnName +
        delimiter +
        datasetView.metadata[columnName]?.kind +
        delimiter +
        // @ts-expect-error - see issue
        datasetView.metadata[columnName]?.nullable +
        delimiter +
        datasetView.metadata[columnName]?.count +
        delimiter +
        datasetView.metadata[columnName]?.nullCount +
        delimiter +
        // @ts-expect-error - see issue
        datasetView.metadata[columnName]?.max +
        delimiter +
        // @ts-expect-error - see issue
        datasetView.metadata[columnName]?.min +
        delimiter +
        // @ts-expect-error - see issue
        datasetView.metadata[columnName]?.mean +
        delimiter +
        // @ts-expect-error - see issue
        datasetView.metadata[columnName]?.median +
        delimiter +
        // @ts-expect-error - see issue
        datasetView.metadata[columnName]?.mode +
        delimiter +
        // @ts-expect-error - see issue
        datasetView.metadata[columnName]?.std +
        delimiter +
        // @ts-expect-error - see issue
        JSON.stringify(datasetView.metadata[columnName]?.distribution) +
        delimiter +
        '\n';
    }
    return metadataRowsString;
  }
}

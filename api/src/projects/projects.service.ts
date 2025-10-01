import {
  $CreateProject,
  $DatasetInfo,
  $DatasetViewPagination,
  $ProjectDataset,
  $ProjectDatasetColumnConfig,
  $TabularDataDownloadFormat,
  $UpdateProject
} from '@databank/core';
import type { Model } from '@douglasneuroinformatics/libnest';
import { InjectModel } from '@douglasneuroinformatics/libnest';
import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import type { ProjectDataset } from '@prisma/client';

import { DatasetsService } from '@/datasets/datasets.service';
import { UsersService } from '@/users/users.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel('Project') private readonly projectModel: Model<'Project'>,
    private readonly usersService: UsersService,
    private readonly datasetService: DatasetsService
  ) {}

  async addDataset(currentUserId: string, projectId: string, projectDataset: $ProjectDataset) {
    const project = await this.getProjectById(currentUserId, projectId);

    if (!project) {
      throw new NotFoundException('Project Not Found!');
    }

    const projectDatasets = project.datasets;
    projectDatasets.forEach((dataset) => {
      if (dataset.datasetId === projectDataset.datasetId) {
        throw new UnprocessableEntityException(
          `Dataset with ID ${projectDataset.datasetId} already exists in the Project!`
        );
      }
    });

    const newProjectDataset: ProjectDataset = {
      columnConfigurations: [],
      columnIds: projectDataset.columnIds,
      datasetId: projectDataset.datasetId,
      rowFilter: {
        rowMax: projectDataset.rowConfig.rowMax,
        rowMin: projectDataset.rowConfig.rowMin
      }
    };

    newProjectDataset.columnConfigurations = Object.entries(projectDataset.columnConfigs).map(([colId, config]) => {
      return {
        columnId: colId,
        hash: config.hash ?? null,
        trim: config.trim ?? null
      };
    });

    projectDatasets.push(newProjectDataset);
    return await this.projectModel.update({
      data: {
        datasets: projectDatasets
      },
      where: {
        id: projectId
      }
    });
  }

  async addUser(currentUserId: string, projectId: string, newUserEmail: string) {
    if (!(await this.isProjectManager(currentUserId, projectId))) {
      throw new UnprocessableEntityException('Only project managers can add new users!');
    }

    const project = await this.getProjectById(currentUserId, projectId);

    if (!project) {
      throw new NotFoundException('Project Not Found!');
    }

    const newUser = await this.usersService.findByEmail(newUserEmail);
    if (!newUser) {
      throw new NotFoundException(`User Not found with email: ${newUserEmail}`);
    }

    const userIdsArray = project.userIds;
    userIdsArray.push(newUser.id);

    return await this.updateProject(currentUserId, projectId, {
      userIds: userIdsArray
    });
  }

  async createProject(currentUserId: string, createProjectDto: $CreateProject) {
    if (!(await this.usersService.isOwnerOfDatasets(currentUserId))) {
      throw new UnprocessableEntityException('Only dataset owners can create project!');
    }

    if (!createProjectDto.userIds.includes(currentUserId)) {
      throw new UnprocessableEntityException('Creator of the project must be a user of the project!');
    }

    return await this.projectModel.create({
      data: { ...createProjectDto, datasets: [] }
    });
  }

  async deleteProject(currentUserId: string, projectId: string) {
    if (!(await this.isProjectManager(currentUserId, projectId))) {
      throw new UnprocessableEntityException('The current user has no right to delete this project!');
    }

    const deletedProject = await this.projectModel.delete({
      where: {
        id: projectId
      }
    });

    return deletedProject;
  }

  async downloadDatasetById(projectId: string, datasetId: string, currentUserId: string, format: 'CSV' | 'TSV') {
    const project = await this.getProjectById(currentUserId, projectId);
    const projectDataset = project.datasets.find((dataset) => dataset.datasetId === datasetId);
    if (!projectDataset) {
      throw new NotFoundException(`Cannot find dataset with ID ${datasetId} in the project`);
    }

    if (projectDataset.columnIds.length === 0) {
      throw new UnprocessableEntityException(`project ${projectId} dataset ${datasetId} has no columns`);
    }

    // set initial row number to number of entries in a column
    let rowNumber: number = await this.datasetService.getColumnLengthById(projectDataset.columnIds[0]!);
    if (projectDataset.rowFilter) {
      if (projectDataset.rowFilter.rowMax && projectDataset.rowFilter.rowMin) {
        rowNumber = projectDataset.rowFilter.rowMax - projectDataset.rowFilter.rowMin;
      } else if (!projectDataset.rowFilter.rowMax && projectDataset.rowFilter.rowMin) {
        rowNumber = rowNumber - projectDataset.rowFilter.rowMin;
        // check for invalid row min input (row min greater than the largest possible value of rows)
        if (rowNumber < 0) {
          throw new UnprocessableEntityException('Row number per page is negative! Check the row min value');
        }
      } else if (projectDataset.rowFilter.rowMax && !projectDataset.rowFilter.rowMin) {
        rowNumber = projectDataset.rowFilter.rowMax;
      }
    }

    const projectDatasetView = await this.datasetService.getProjectDatasetViewById(
      this.formatProjectDataset(projectDataset),
      {
        currentPage: 1,
        itemsPerPage: rowNumber
      },
      {
        currentPage: 1,
        itemsPerPage: projectDataset.columnIds.length
      }
    );

    const delimiter = format === 'CSV' ? ',' : '\t';
    let resultString = projectDatasetView.columns.join(delimiter) + '\n';
    for (const row of projectDatasetView.rows) {
      resultString += Object.values(row).join(delimiter) + '\n';
    }

    return resultString;
  }

  async downloadDatasetMetadataById(
    projectId: string,
    datasetId: string,
    currentUserId: string,
    format: $TabularDataDownloadFormat
  ) {
    const project = await this.getProjectById(currentUserId, projectId);
    const projectDataset = project.datasets.find((dataset) => dataset.datasetId === datasetId);
    if (!projectDataset) {
      throw new NotFoundException(`Cannot find dataset with ID ${datasetId} in the project`);
    }

    if (projectDataset.columnIds.length === 0) {
      throw new UnprocessableEntityException(`project ${projectId} dataset ${datasetId} has no columns`);
    }
    // set initial row number to number of entries in a column
    let rowNumber: number = await this.datasetService.getColumnLengthById(projectDataset.columnIds[0]!);
    if (projectDataset.rowFilter) {
      if (projectDataset.rowFilter.rowMax && projectDataset.rowFilter.rowMin) {
        rowNumber = projectDataset.rowFilter.rowMax - projectDataset.rowFilter.rowMin;
      } else if (!projectDataset.rowFilter.rowMax && projectDataset.rowFilter.rowMin) {
        rowNumber = rowNumber - projectDataset.rowFilter.rowMin;
        // check for invalid row min input (row min greater than the largest possible value of rows)
        if (rowNumber < 0) {
          throw new UnprocessableEntityException('Row number per page is negative! Check the row min value');
        }
      } else if (projectDataset.rowFilter.rowMax && !projectDataset.rowFilter.rowMin) {
        rowNumber = projectDataset.rowFilter.rowMax;
      }
    }

    const projectDatasetView = await this.datasetService.getProjectDatasetViewById(
      this.formatProjectDataset(projectDataset),
      {
        currentPage: 1,
        itemsPerPage: rowNumber
      },
      {
        currentPage: 1,
        itemsPerPage: projectDataset.columnIds.length
      }
    );

    return this.datasetService.formatMetadataDownloadString(format, {
      ...projectDatasetView,
      primaryKeys: []
    });
  }

  async getAllProjects(currentUserId: string) {
    return await this.projectModel.findMany({
      where: {
        userIds: {
          has: currentUserId
        }
      }
    });
  }

  async getDashboardSummary(currentUserId: string) {
    const projects = await this.projectModel.findMany({
      where: {
        userIds: {
          has: currentUserId
        }
      }
    });

    const datasets = await this.datasetService.getAllByManagerId(currentUserId);

    return {
      datasetCounts: datasets.length,
      projectCounts: projects.length
    };
  }

  async getOneProjectDatasetView(
    projectId: string,
    datasetId: string,
    rowPaginationDto: $DatasetViewPagination,
    columnPaginationDto: $DatasetViewPagination
  ) {
    // get project
    const project = await this.projectModel.findUnique({
      where: {
        id: projectId
      }
    });

    if (!project) {
      throw new NotFoundException('Project Not Found!');
    }

    const projectDataset = project.datasets.find((dataset) => dataset.datasetId === datasetId);
    if (!projectDataset) {
      throw new NotFoundException(`Cannot find dataset with ID ${datasetId} in the project`);
    }

    return await this.datasetService.getProjectDatasetViewById(
      this.formatProjectDataset(projectDataset),
      rowPaginationDto,
      columnPaginationDto
    );
  }

  async getProjectById(currentUserId: string, projectId: string) {
    const project = await this.projectModel.findUnique({
      where: {
        id: projectId,
        userIds: {
          has: currentUserId
        }
      }
    });

    if (!project) {
      throw new NotFoundException(`Cannot find project with id ${projectId} for
        user with id ${currentUserId}`);
    }

    // const isProjectManager = this.isProjectManager(currentUserId, project.id);
    // return { ...project, isProjectManager };

    return project;
  }

  async getProjectDatasets(projectId: string): Promise<$DatasetInfo[]> {
    const project = await this.projectModel.findUnique({
      where: {
        id: projectId
      }
    });
    if (!project) {
      throw new NotFoundException(`Project with id ${projectId} cannot be found`);
    }
    const projectDatasetsInfo: $DatasetInfo[] = [];
    const datasetIdToRemove: string[] = [];
    for (const projectDataset of project.datasets) {
      const projectDatasetInfo = await this.datasetService.getById(projectDataset.datasetId);
      if (!projectDatasetInfo) {
        datasetIdToRemove.push(projectDataset.datasetId);
      }

      if (!projectDatasetInfo?.permission) {
        continue;
      }

      projectDatasetsInfo.push({
        ...projectDatasetInfo,
        createdAt: projectDatasetInfo.createdAt,
        permission: projectDatasetInfo?.permission
      });
    }

    const newProjectDatasets = project.datasets.filter((dataset) => {
      return !datasetIdToRemove.includes(dataset.datasetId);
    });

    await this.projectModel.update({
      data: {
        datasets: newProjectDatasets
      },
      where: {
        id: projectId
      }
    });

    return projectDatasetsInfo;
  }

  public async isProjectManager(currentUserId: string, projectId: string) {
    const user = await this.usersService.findById(currentUserId);
    const project = await this.getProjectById(currentUserId, projectId);

    const datasetIdSet = new Set();
    for (const curr_datasetId of user.datasetIds) {
      datasetIdSet.add(curr_datasetId);
    }

    for (const dataset of project.datasets) {
      if (datasetIdSet.has(dataset.datasetId)) {
        return true;
      }
    }

    return false;
  }

  async removeDataset(currentUserId: string, projectId: string, datasetId: string) {
    if (!(await this.isProjectManager(currentUserId, projectId))) {
      throw new UnprocessableEntityException('Only project managers can remove dataset!');
    }

    const project = await this.getProjectById(currentUserId, projectId);

    const newProjectDatasets = project.datasets.filter((dataset) => dataset.datasetId !== datasetId);

    return await this.updateProject(currentUserId, projectId, {
      datasets: newProjectDatasets
    });
  }

  async removeUser(currentUserId: string, projectId: string, userIdToRemove: string) {
    if (!(await this.isProjectManager(currentUserId, projectId))) {
      throw new UnprocessableEntityException('Only project managers can remove users!');
    }

    const project = await this.getProjectById(currentUserId, projectId);

    if (!project) {
      throw new NotFoundException('Project Not Found!');
    }

    const userIdsArray = project.userIds;
    const newUserIdsArray = userIdsArray.filter((userId) => userId !== userIdToRemove);

    return await this.updateProject(currentUserId, projectId, {
      userIds: newUserIdsArray
    });
  }

  async updateProject(currentUserId: string, projectId: string, updateProjectDto: $UpdateProject) {
    const isProjectManager = await this.isProjectManager(currentUserId, projectId);
    if (!isProjectManager) {
      throw new UnprocessableEntityException('The current user has no right to manipulate this project!');
    }

    const updateProject = await this.projectModel.update({
      data: updateProjectDto,
      where: {
        id: projectId
      }
    });
    return updateProject;
  }

  private formatProjectDataset(projectDatasetData: ProjectDataset): $ProjectDataset {
    const columnConfigs: {
      [key: string]: $ProjectDatasetColumnConfig;
    } = {};
    for (const colConfig of projectDatasetData.columnConfigurations) {
      columnConfigs[colConfig.columnId] = {
        hash: colConfig.hash ?? null,
        trim: colConfig.trim ?? null
      };
    }
    return {
      columnConfigs: columnConfigs,
      columnIds: projectDatasetData.columnIds,
      datasetId: projectDatasetData.datasetId,
      rowConfig: {
        rowMax: projectDatasetData.rowFilter.rowMax ?? null,
        rowMin: projectDatasetData.rowFilter.rowMin
      }
    };
  }
}

import type { DatasetInfo, DatasetViewPaginationDto, ProjectDatasetDto } from '@databank/types';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@/core/decorators/inject-prisma-client.decorator';
import { DatasetsService } from '@/datasets/datasets.service';
import type { Model } from '@/prisma/prisma.types';
import { UsersService } from '@/users/users.service';

import type { CreateProjectDto, UpdateProjectDto } from './zod/projects';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel('Project') private readonly projectModel: Model<'Project'>,
    private readonly usersService: UsersService,
    private readonly datasetService: DatasetsService
  ) {}

  async addDataset(currentUserId: string, projectId: string, projectDatasetDto: ProjectDatasetDto) {
    const project = await this.getProjectById(currentUserId, projectId);

    if (!project) {
      throw new NotFoundException('Project Not Found!');
    }

    const projectDatasets = project.datasets;
    projectDatasets.forEach((dataset) => {
      if (dataset.datasetId === projectDatasetDto.datasetId) {
        throw new ForbiddenException(`Dataset with ID ${projectDatasetDto.datasetId} already exists in the Project!`);
      }
    });
    projectDatasets.push(projectDatasetDto);
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
      throw new ForbiddenException('Only project managers can add new users!');
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

  async createProject(currentUserId: string, createProjectDto: CreateProjectDto) {
    if (!(await this.usersService.isOwnerOfDatasets(currentUserId))) {
      throw new ForbiddenException('Only dataset owners can create project!');
    }

    if (!createProjectDto.userIds.includes(currentUserId)) {
      throw new ForbiddenException('Creator of the project must be a user of the project!');
    }

    return await this.projectModel.create({
      data: createProjectDto
    });
  }

  async deleteProject(currentUserId: string, projectId: string) {
    if (!(await this.isProjectManager(currentUserId, projectId))) {
      throw new ForbiddenException('The current user has no right to delete this project!');
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
    const projectDatasetDto = project.datasets.find((dataset) => dataset.datasetId === datasetId);
    if (!projectDatasetDto) {
      throw new NotFoundException(`Cannot find dataset with ID ${datasetId} in the project`);
    }

    // set initial row number to number of entries in a column
    let rowNumber: number = await this.datasetService.getColumnLengthById(projectDatasetDto.columns[0]!.columnId);
    if (projectDatasetDto.rowFilter) {
      if (projectDatasetDto.rowFilter.rowMax && projectDatasetDto.rowFilter.rowMin) {
        rowNumber = projectDatasetDto.rowFilter.rowMax - projectDatasetDto.rowFilter.rowMin;
      } else if (!projectDatasetDto.rowFilter.rowMax && projectDatasetDto.rowFilter.rowMin) {
        rowNumber = rowNumber - projectDatasetDto.rowFilter.rowMin;
        // check for invalid row min input (row min greater than the largest possible value of rows)
        if (rowNumber < 0) {
          throw new ForbiddenException('Row number per page is nagative! Check the row min value');
        }
      } else if (projectDatasetDto.rowFilter.rowMax && !projectDatasetDto.rowFilter.rowMin) {
        rowNumber = projectDatasetDto.rowFilter.rowMax;
      }
    }

    const projectDatasetView = await this.datasetService.getProjectDatasetViewById(
      projectDatasetDto,
      {
        currentPage: 1,
        itemsPerPage: rowNumber
      },
      {
        currentPage: 1,
        itemsPerPage: projectDatasetDto.columns.length
      }
    );

    const delimiter = format === 'CSV' ? ',' : '\t';
    let resultString = projectDatasetView.columns.join(delimiter) + '\n';
    for (let row of projectDatasetView.rows) {
      resultString += Object.values(row).join(delimiter) + '\n';
    }

    return resultString;
  }

  async downloadDatasetMetadataById(
    projectId: string,
    datasetId: string,
    currentUserId: string,
    format: 'CSV' | 'TSV'
  ) {
    const project = await this.getProjectById(currentUserId, projectId);
    const projectDatasetDto = project.datasets.find((dataset) => dataset.datasetId === datasetId);
    if (!projectDatasetDto) {
      throw new NotFoundException(`Cannot find dataset with ID ${datasetId} in the project`);
    }

    // set initial row number to number of entries in a column
    let rowNumber: number = await this.datasetService.getColumnLengthById(projectDatasetDto.columns[0]!.columnId);
    if (projectDatasetDto.rowFilter) {
      if (projectDatasetDto.rowFilter.rowMax && projectDatasetDto.rowFilter.rowMin) {
        rowNumber = projectDatasetDto.rowFilter.rowMax - projectDatasetDto.rowFilter.rowMin;
      } else if (!projectDatasetDto.rowFilter.rowMax && projectDatasetDto.rowFilter.rowMin) {
        rowNumber = rowNumber - projectDatasetDto.rowFilter.rowMin;
        // check for invalid row min input (row min greater than the largest possible value of rows)
        if (rowNumber < 0) {
          throw new ForbiddenException('Row number per page is nagative! Check the row min value');
        }
      } else if (projectDatasetDto.rowFilter.rowMax && !projectDatasetDto.rowFilter.rowMin) {
        rowNumber = projectDatasetDto.rowFilter.rowMax;
      }
    }

    const projectDatasetView = await this.datasetService.getProjectDatasetViewById(
      projectDatasetDto,
      {
        currentPage: 1,
        itemsPerPage: rowNumber
      },
      {
        currentPage: 1,
        itemsPerPage: projectDatasetDto.columns.length
      }
    );
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
    for (let columnName of Object.keys(projectDatasetView.metadata)) {
      metadataRowsString +=
        columnName +
        delimiter +
        projectDatasetView.metadata[columnName]?.kind +
        delimiter +
        // @ts-expect-error - see issue
        projectDatasetView.metadata[columnName]?.nullable +
        delimiter +
        projectDatasetView.metadata[columnName]?.count +
        delimiter +
        projectDatasetView.metadata[columnName]?.nullCount +
        delimiter +
        // @ts-expect-error - see issue
        projectDatasetView.metadata[columnName]?.max +
        delimiter +
        // @ts-expect-error - see issue
        projectDatasetView.metadata[columnName]?.min +
        delimiter +
        // @ts-expect-error - see issue
        projectDatasetView.metadata[columnName]?.mean +
        delimiter +
        // @ts-expect-error - see issue
        projectDatasetView.metadata[columnName]?.median +
        delimiter +
        // @ts-expect-error - see issue
        projectDatasetView.metadata[columnName]?.mode +
        delimiter +
        // @ts-expect-error - see issue
        projectDatasetView.metadata[columnName]?.std +
        delimiter +
        // @ts-expect-error - see issue
        JSON.stringify(projectDatasetView.metadata[columnName]?.distribution) +
        delimiter +
        '\n';
    }
    return metadataRowsString;
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
    rowPaginationDto: DatasetViewPaginationDto,
    columnPaginationDto: DatasetViewPaginationDto
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

    const projectDatasetDto = project.datasets.find((dataset) => dataset.datasetId === datasetId);
    if (!projectDatasetDto) {
      throw new NotFoundException(`Cannot find dataset with ID ${datasetId} in the project`);
    }

    return await this.datasetService.getProjectDatasetViewById(
      projectDatasetDto,
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

  async getProjectDatasets(projectId: string) {
    const project = await this.projectModel.findUnique({
      where: {
        id: projectId
      }
    });
    if (!project) {
      throw new NotFoundException(`Project with id ${projectId} cannot be found`);
    }
    const projectDatasetsInfo: DatasetInfo[] = [];
    const datasetIdToRemove: string[] = [];
    for (let projectDataset of project.datasets) {
      const projectDatasetInfo = await this.datasetService.getById(projectDataset.datasetId);
      if (!projectDatasetInfo) {
        datasetIdToRemove.push(projectDataset.datasetId);
      }
      projectDatasetsInfo.push(projectDatasetInfo!);
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
    for (let curr_datasetId of user.datasetId) {
      datasetIdSet.add(curr_datasetId);
    }

    for (let dataset of project.datasets) {
      if (datasetIdSet.has(dataset.datasetId)) {
        return true;
      }
    }

    return false;
  }

  async removeDataset(currentUserId: string, projectId: string, datasetId: string) {
    if (!(await this.isProjectManager(currentUserId, projectId))) {
      throw new ForbiddenException('Only project managers can remove dataset!');
    }

    const project = await this.getProjectById(currentUserId, projectId);

    const newProjectDatasets = project.datasets.filter((dataset) => dataset.datasetId !== datasetId);

    return await this.updateProject(currentUserId, projectId, { datasets: newProjectDatasets });
  }

  async removeUser(currentUserId: string, projectId: string, userIdToRemove: string) {
    if (!(await this.isProjectManager(currentUserId, projectId))) {
      throw new ForbiddenException('Only project managers can remove users!');
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

  async updateProject(currentUserId: string, projectId: string, updateProjectDto: UpdateProjectDto) {
    const isProjectManager = await this.isProjectManager(currentUserId, projectId);
    if (!isProjectManager) {
      throw new ForbiddenException('The current user has no right to manipulate this project!');
    }

    const updateProject = await this.projectModel.update({
      data: updateProjectDto,
      where: {
        id: projectId
      }
    });
    return updateProject;
  }
}

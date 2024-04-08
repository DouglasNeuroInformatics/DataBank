import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { PrismaClient } from '@prisma/client';

import { InjectModel, InjectPrismaClient } from '@/core/decorators/inject-prisma-client.decorator';
import type { Model } from '@/prisma/prisma.types';
import type { UsersService } from '@/users/users.service';

import type { CreateProjectDto, ProjectDatasetDto, UpdateProjectDto } from './zod/projects';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel('Project') private readonly projectModel: Model<'Project'>,
    private readonly usersService: UsersService,
    @InjectPrismaClient() private prisma: PrismaClient
  ) {}

  async addDatasetToProject(currentUserId: string, projectId: string, projectDatasetDto: ProjectDatasetDto) {
    if (!this.isProjectManager(currentUserId, projectId)) {
      throw new ForbiddenException('Only project managers can add new dataset!');
    }

    const project = await this.getProjectById(currentUserId, projectId);

    if (!project) {
      throw new NotFoundException('Project Not Found!');
    }

    const projectDatasets = project.datasets;
    projectDatasets.push(projectDatasetDto);
    return await this.updateProject(currentUserId, projectId, {});
  }

  async addUserToProject(currentUserId: string, projectId: string, newUserId: string) {
    if (!this.isProjectManager(currentUserId, projectId)) {
      throw new ForbiddenException('Only project managers can add new users!');
    }

    const project = await this.getProjectById(currentUserId, projectId);

    if (!project) {
      throw new NotFoundException('Project Not Found!');
    }

    const userIdsArray = project.userIds;
    userIdsArray.push(newUserId);

    return await this.updateProject(currentUserId, projectId, {
      userIds: userIdsArray
    });
  }

  async createProject(currentUserId: string, createProjectDto: CreateProjectDto) {
    if (!this.usersService.isOwnerOfDatasets(currentUserId)) {
      throw new ForbiddenException('Only dataset owners can create project!');
    }

    if (!(currentUserId in createProjectDto.userIds)) {
      throw new ForbiddenException('Creator of the project must be a user of the project!');
    }

    return await this.projectModel.create({
      data: createProjectDto
    });
  }

  async deleteProject(currentUserId: string, projectId: string) {
    if (!this.isProjectManager(currentUserId, projectId)) {
      throw new ForbiddenException('The current user has no right to delete this project!');
    }

    const deletaProject = this.projectModel.delete({
      where: {
        id: projectId
      }
    });

    return await this.prisma.$transaction([deletaProject]);
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
      throw new NotFoundException(`Cannot find project with id ${projectId}`);
    }

    return project;
  }

  async updateProject(currentUserId: string, projectId: string, updateProjectDto: UpdateProjectDto) {
    const isProjectManager = this.isProjectManager(currentUserId, projectId);
    if (!isProjectManager) {
      throw new ForbiddenException('The current user has no right to manipulate this project!');
    }

    const updateProject = this.projectModel.update({
      data: updateProjectDto,
      where: {
        id: projectId
      }
    });
    return await this.prisma.$transaction([updateProject]);
  }

  private async isProjectManager(currentUserId: string, projectId: string) {
    const user = await this.usersService.findById(currentUserId);
    const project = await this.getProjectById(currentUserId, projectId);

    const datasetIdSet = new Set();
    for (let curr_datasetId in user.datasetId) {
      datasetIdSet.add(curr_datasetId);
    }

    for (let i = 0; i < project.datasets.length; i++) {
      if (datasetIdSet.has(project.datasets[i]?.datasetId)) {
        return true;
      }
    }

    return false;
  }
}

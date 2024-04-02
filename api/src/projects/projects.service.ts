import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { PrismaClient } from '@prisma/client';

import { InjectModel, InjectPrismaClient } from '@/core/decorators/inject-prisma-client.decorator';
import type { Model } from '@/prisma/prisma.types';
import type { UsersService } from '@/users/users.service';

import type { CreateProjectDto, UpdateProjectDto } from './zod/projects';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel('Project') private readonly projectModel: Model<'Project'>,
    private readonly usersService: UsersService,
    @InjectPrismaClient() private prisma: PrismaClient
  ) {}

  addDatasetToProject(currentUserId: string, datasetId: string) {
    return [currentUserId, datasetId];
  }

  addUserToProject(currentUserId: string, newUserId: string) {
    return [currentUserId, newUserId];
  }

  async createProject(createProjectDto: CreateProjectDto) {
    // must add the current user id to the users array
    // only certain users can create a project
    return await this.projectModel.create({
      data: createProjectDto
    });
  }

  async deleteProject(currentUserId: string, projectId: string) {
    if (!this.isProjectManager(currentUserId, projectId)) {
      throw new ForbiddenException('The current user has no right to manipulate this project!');
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

    for (let dataset in project.datasets) {
      if (datasetIdSet.has(dataset)) {
        return true;
      }
    }

    return false;
  }
}

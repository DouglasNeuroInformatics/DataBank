import { CurrentUser } from '@douglasneuroinformatics/libnest/core';
import { Injectable } from '@nestjs/common';

import { InjectModel } from '@/core/decorators/inject-prisma-client.decorator';
import type { Model } from '@/prisma/prisma.types';

import type { CreateProjectDto, UpdateProjectDto } from './zod/projects';

@Injectable()
export class ProjectsService {
  constructor(@InjectModel('Project') private readonly projectModel: Model<'Project'>) {}

  addDatasetToProject(@CurrentUser('id') currentUserId: string, datasetId: string) {
    return [currentUserId, datasetId];
  }

  addUserToProject(@CurrentUser('id') currentUserId: string, newUserId: string) {
    return [currentUserId, newUserId];
  }

  createProject(@CurrentUser('id') currentUserId: string, createProjectDto: CreateProjectDto) {
    return [currentUserId, createProjectDto];
  }

  deleteProject(@CurrentUser('id') currentUserId: string, projectID: string) {
    return [currentUserId, projectID];
  }

  getAllProjects(@CurrentUser('id') currentUserId: string) {
    return [currentUserId, currentUserId];
  }

  getProjectById(@CurrentUser('id') currentUserId: string, projectID: string) {
    return [currentUserId, projectID];
  }

  updateProject(@CurrentUser('id') currentUserId: string, updateProjectDto: UpdateProjectDto) {
    return [currentUserId, updateProjectDto];
  }
}

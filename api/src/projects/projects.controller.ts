import { CurrentUser } from '@douglasneuroinformatics/libnest/core';
import { Controller } from '@nestjs/common';

import { ProjectsService } from './projects.service';

import type { CreateProjectDto, UpdateProjectDto } from './zod/projects';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  addDatasetToProject(@CurrentUser('id') currentUserId: string, datasetId: string) {
    return this.projectsService.addDatasetToProject(currentUserId, datasetId);
  }

  addUserToProject(@CurrentUser('id') currentUserId: string, newUserId: string) {
    return this.projectsService.addUserToProject(currentUserId, newUserId);
  }

  createProject(@CurrentUser('id') currentUserId: string, createProjectDto: CreateProjectDto) {
    return this.projectsService.createProject(currentUserId, createProjectDto);
  }

  deleteProject(@CurrentUser('id') currentUserId: string, projectId: string) {
    return this.projectsService.deleteProject(currentUserId, projectId);
  }

  getAllProjects(@CurrentUser('id') currentUserId: string) {
    return this.projectsService.getAllProjects(currentUserId);
  }

  getProjectById(@CurrentUser('id') currentUserId: string, projectId: string) {
    return this.projectsService.getProjectById(currentUserId, projectId);
  }

  updateProject(@CurrentUser('id') currentUserId: string, projectId: string, updateProjectDto: UpdateProjectDto) {
    return this.projectsService.updateProject(currentUserId, projectId, updateProjectDto);
  }
}

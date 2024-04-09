import { CurrentUser } from '@douglasneuroinformatics/libnest/core';
import { Controller } from '@nestjs/common';

import { ProjectsService } from './projects.service';

import type { CreateProjectDto, ProjectDatasetDto, UpdateProjectDto } from './zod/projects';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  addDatasetToProject(
    @CurrentUser('id') currentUserId: string,
    projectId: string,
    projectDatasetDto: ProjectDatasetDto
  ) {
    return this.projectsService.addDataset(currentUserId, projectId, projectDatasetDto);
  }

  addUserToProject(@CurrentUser('id') currentUserId: string, projectId: string, newUserId: string) {
    return this.projectsService.addUser(currentUserId, projectId, newUserId);
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

import { CurrentUser } from '@douglasneuroinformatics/libnest/core';
import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ProjectsService } from './projects.service';

import type { CreateProjectDto, ProjectDatasetDto, UpdateProjectDto } from './zod/projects';

@ApiTags('Projects')
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

  @Delete(':id')
  deleteProject(@CurrentUser('id') currentUserId: string, @Param('id') projectId: string) {
    return this.projectsService.deleteProject(currentUserId, projectId);
  }

  @Get()
  getAllProjects(@CurrentUser('id') currentUserId: string) {
    return this.projectsService.getAllProjects(currentUserId);
  }

  @Get(':id')
  getProjectById(@CurrentUser('id') currentUserId: string, @Param('id') projectId: string) {
    return this.projectsService.getProjectById(currentUserId, projectId);
  }

  updateProject(@CurrentUser('id') currentUserId: string, projectId: string, updateProjectDto: UpdateProjectDto) {
    return this.projectsService.updateProject(currentUserId, projectId, updateProjectDto);
  }
}

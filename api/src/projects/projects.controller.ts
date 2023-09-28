import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { type ObjectId } from 'mongoose';

import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectColumnDto } from './dto/project-column.dto.js';
import { ProjectsService } from './projects.service.js';

import { RouteAccess } from '@/core/decorators/route-access.decorator.js';
import { ParseIdPipe } from '@/core/pipes/parse-id.pipe.js';

@ApiTags('Projects')
@Controller({ path: 'projects' })
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOperation({ summary: 'Create Project' })
  @Post()
  @RouteAccess({ role: 'standard' })
  createProject(@Body() createProjectDto: CreateProjectDto) {
    return createProjectDto;
  }

  @ApiOperation({ summary: 'Get Project Based on id' })
  @Get(':id')
  @RouteAccess({ role: 'standard' })
  getById(@Param('id', ParseIdPipe) id: ObjectId) {
    return this.projectsService.getById(id);
  }

  @Delete(':id')
  @RouteAccess({ role: 'standard' })
  deleteProject(@Param('id', ParseIdPipe) id: ObjectId) {
    return this.projectsService.deleteProject(id);
  }

  @ApiOperation({ summary: 'Update Project' })
  @Patch(':id')
  @RouteAccess({ role: 'standard' })
  updateColumn(@Param('id', ParseIdPipe) id: ObjectId, @Body() updateColumnDto: UpdateProjectColumnDto) {
    return this.projectsService.updateColumn(id, updateColumnDto);
  }
}

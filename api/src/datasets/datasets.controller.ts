/* eslint-disable perfectionist/sort-classes */
import type { DatasetViewPaginationDto, ProjectDatasetDto } from '@databank/types';
import { CurrentUser, ParseObjectIdPipe } from '@douglasneuroinformatics/libnest/core';
import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { RouteAccess } from '@/core/decorators/route-access.decorator';

import { DatasetsService } from './datasets.service.js';

import type { CreateTabularDatasetDto } from './zod/dataset.js';

@ApiTags('Datasets')
@Controller({ path: 'datasets' })
export class DatasetsController {
  constructor(private readonly datasetsService: DatasetsService) {}

  @Patch('managers/:id/:managerEmailToAdd')
  @RouteAccess({ role: 'STANDARD' })
  addManager(
    @Param('id') datasetId: string,
    @CurrentUser('id') managerId: string,
    @Param('managerEmailToAdd') managerEmailToAdd: string
  ) {
    return this.datasetsService.addManager(datasetId, managerId, managerEmailToAdd);
  }

  @ApiOperation({ summary: 'Create Dataset' })
  @Post('create')
  @RouteAccess({ role: 'STANDARD' })
  @UseInterceptors(FileInterceptor('file'))
  createDataset(
    @Body() createTabularDatasetDto: CreateTabularDatasetDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('id') managerId: string
  ) {
    return this.datasetsService.createDataset(createTabularDatasetDto, file, managerId);
  }

  @Delete(':id')
  @RouteAccess({ role: 'STANDARD' })
  deleteDataset(@Param('id', ParseObjectIdPipe) datasetId: string, @CurrentUser('id') currentUserId: string) {
    return this.datasetsService.deleteDataset(datasetId, currentUserId);
  }

  @ApiOperation({ summary: 'Get Public Datasets' })
  @RouteAccess('public')
  @Get('public')
  getPublic() {
    return this.datasetsService.getPublic();
  }

  @ApiOperation({ summary: 'Get Public Datasets' })
  @RouteAccess('public')
  @Post('public/:id')
  getOnePublicById(
    @Param('id') datasetId: string,
    @Body('rowPaginationDto') rowPaginationDto: DatasetViewPaginationDto,
    @Body('columnPaginationDto') columnPaginationDto: DatasetViewPaginationDto
  ) {
    return this.datasetsService.getOnePublicById(datasetId, rowPaginationDto, columnPaginationDto);
  }

  @ApiOperation({ summary: 'Get All Available Datasets' })
  @Get()
  @RouteAccess({ role: 'STANDARD' })
  getAvailable(@CurrentUser('id') currentUserId: string) {
    return this.datasetsService.getAvailable(currentUserId);
  }

  @ApiOperation({ summary: 'Get All Info and Data for Dataset' })
  @Post(':id')
  @RouteAccess({ role: 'STANDARD' })
  getViewById(
    @Param('id') datasetId: string,
    @CurrentUser('id') currentUserId: string,
    @Body('rowPaginationDto') datasetViewRowPaginationDto: DatasetViewPaginationDto,
    @Body('columnPaginationDto') datasetViewColumnPaginationDto: DatasetViewPaginationDto
  ) {
    return this.datasetsService.getViewById(
      datasetId,
      currentUserId,
      datasetViewRowPaginationDto,
      datasetViewColumnPaginationDto
    );
  }

  @ApiOperation({ summary: 'Get All Info and Data for Dataset' })
  @Post('/project')
  @RouteAccess({ role: 'STANDARD' })
  getProjectDatasetViewById(
    @Body('rowPaginationDto') rowPaginationDto: DatasetViewPaginationDto,
    @Body('columnPaginationDto') columnPaginationDto: DatasetViewPaginationDto,
    @Body('projectDatasetDto') projectDatasetDto: ProjectDatasetDto
  ) {
    return this.datasetsService.getProjectDatasetViewById(projectDatasetDto, rowPaginationDto, columnPaginationDto);
  }

  @Delete('managers/:id/:managerIdToRemove')
  @RouteAccess({ role: 'STANDARD' })
  removeManager(
    @Param('id') datasetId: string,
    @CurrentUser('id') managerId: string,
    @Param('managerIdToRemove') managerIdToRemove: string
  ) {
    return this.datasetsService.removeManager(datasetId, managerId, managerIdToRemove);
  }

  @Patch('share/:id')
  @RouteAccess({ role: 'STANDARD' })
  setReadyToShare(@Param('id') datasetId: string, @CurrentUser('id') managerId: string) {
    return this.datasetsService.setReadyToShare(datasetId, managerId);
  }

  // @Patch(':id/:column')
  // @RouteAccess({ role: 'STANDARD' })
  // updateColumn(
  //   @Body() dto: UpdateDatasetColumnDto,
  //   @Param('id', ParseIdPipe) id: ObjectId,
  //   @Param('column') column?: string
  // ) {
  //   return this.datasetsService.updateColumn(dto, id, column);
  // }
}

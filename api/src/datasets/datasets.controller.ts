import { ParseIdPipe } from '@douglasneuroinformatics/nestjs/core';
import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import 'multer';

import { RouteAccess } from '@/core/decorators/route-access.decorator';
import { UserId } from '@/core/decorators/user-id.decorator';

import { DatasetsService } from './datasets.service';

import type { CreateTabularDatasetDto } from './zod/dataset';

@ApiTags('Datasets')
@Controller({ path: 'datasets' })
export class DatasetsController {
  constructor(private readonly datasetsService: DatasetsService) { }

  @Patch('managers/:id/:managerIdToAdd')
  @RouteAccess({ role: 'STANDARD' })
  addManager(
    @Param('id') datasetId: string,
    @UserId() managerId: string,
    @Param('managerIdToAdd', ParseIdPipe) managerIdToAdd: string,
  ) {
    return this.datasetsService.addManager(datasetId, managerId, managerIdToAdd);
  }

  @ApiOperation({ summary: 'Create Dataset' })
  @Post()
  @RouteAccess({ role: 'STANDARD' })
  @UseInterceptors(FileInterceptor('file'))
  createDataset(@Body() createTabularDatasetDto: CreateTabularDatasetDto, @UploadedFile() file: Express.Multer.File, @UserId() managerId: string) {
    return this.datasetsService.createDataset(createTabularDatasetDto, file, managerId);
  }

  @Delete(':id/:column')
  @RouteAccess({ role: 'STANDARD' })
  deleteColumn(@Param('column') columnId: string, @UserId() currentUserId: string) {
    return this.datasetsService.deleteColumn(columnId, currentUserId);
  }

  @Delete(':id')
  @RouteAccess({ role: 'STANDARD' })
  deleteDataset(@Param('id', ParseIdPipe) datasetId: string, @UserId() currentUserId: string) {
    return this.datasetsService.deleteDataset(datasetId, currentUserId);
  }

  @ApiOperation({ summary: 'Get All Datasets' })
  @Get('available')
  @RouteAccess({ role: 'STANDARD' })
  getAvailable() {
    return this.datasetsService.getAvailable();
  }

  @ApiOperation({ summary: 'Get All Info and Data for Dataset' })
  @Get(':id')
  @RouteAccess({ role: 'STANDARD' })
  getById(@Param('id') datasetId: string, @UserId() currentUserId: string) {
    return this.datasetsService.getById(datasetId, currentUserId);
  }

  @Patch('manageDataset/managers/remove/:id/:managerIdToRemove')
  @RouteAccess({ role: 'STANDARD' })
  removeManager(
    @Param('id') datasetId: string,
    @UserId() managerId: string,
    @Param('managerIdToAdd') managerIdToRemove: string,
  ) {
    return this.datasetsService.removeManager(datasetId, managerId, managerIdToRemove);
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

  @Patch('manageDataset/share')
  @RouteAccess({ role: 'STANDARD' })
  setReadyToShare(
    @Param('id') datasetId: string,
    @UserId() managerId: string,
  ) {
    return this.datasetsService.setReadyToShare(datasetId, managerId);
  }
}

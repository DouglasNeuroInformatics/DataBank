import { ParseIdPipe } from '@douglasneuroinformatics/nestjs/core';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { type ObjectId } from 'mongoose';
import 'multer';

import { RouteAccess } from '@/core/decorators/route-access.decorator';
import { UserId } from '@/core/decorators/user-id.decorator';

import { DatasetsService } from './datasets.service';

import type { DatasetInfo } from './zod/dataset';

@ApiTags('Datasets')
@Controller({ path: 'datasets' })
export class DatasetsController {
  constructor(private readonly datasetsService: DatasetsService) { }

  @ApiOperation({ summary: 'Create Dataset' })
  @Post()
  @RouteAccess({ role: 'STANDARD' })
  @UseInterceptors(FileInterceptor('file'))
  createDataset(@Body() createDatasetDto: CreateDatasetDto, @UploadedFile() file: Express.Multer.File, @UserId() managerId: string) {
    return this.datasetsService.createDataset(createDatasetDto, file, managerId);
  }

  @Delete(':id/:column')
  @RouteAccess({ role: 'STANDARD' })
  deleteColumn(@Param('id', ParseIdPipe) id: string, @Param('column') columnId?: string, @UserId() currentUserId: string) {
    return this.datasetsService.deleteColumn(id, columnId, currentUserId);
  }

  @Delete(':id')
  @RouteAccess({ role: 'STANDARD' })
  deleteDataset(@Param('id', ParseIdPipe) datasetId: string, @UserId() currentUserId: string) {
    return this.datasetsService.deleteDataset(datasetId, currentUserId);
  }

  @ApiOperation({ summary: 'Get All Datasets' })
  @Get('available')
  @RouteAccess({ role: 'STANDARD' })
  getAvailable(@Query('owner', new ParseIdPipe({ isOptional: true })) ownerId?: string): Promise<DatasetInfo[]> {
    return this.datasetsService.getAvailable(ownerId);
  }

  @ApiOperation({ summary: 'Get All Info and Data for Dataset' })
  @Get(':id')
  @RouteAccess({ role: 'STANDARD' })
  getById(@Param('id', ParseIdPipe) id: ObjectId) {
    return this.datasetsService.getById(id);
  }

  @Patch(':id/:column')
  @RouteAccess({ role: 'STANDARD' })
  updateColumn(
    @Body() dto: UpdateDatasetColumnDto,
    @Param('id', ParseIdPipe) id: ObjectId,
    @Param('column') column?: string
  ) {
    return this.datasetsService.updateColumn(dto, id, column);
  }
}

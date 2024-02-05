import type { DatasetInfo } from '@databank/types';
import { ParseIdPipe } from '@douglasneuroinformatics/nestjs/core';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { type ObjectId } from 'mongoose';
import 'multer';

import { RouteAccess } from '@/core/decorators/route-access.decorator';
import { UserId } from '@/core/decorators/user-id.decorator';

import { DatasetsService } from './datasets.service';

@ApiTags('Datasets')
@Controller({ path: 'datasets' })
export class DatasetsController {
  constructor(private readonly datasetsService: DatasetsService) { }

  @ApiOperation({ summary: 'Create Dataset' })
  @Post()
  @RouteAccess({ role: 'standard' })
  @UseInterceptors(FileInterceptor('file'))
  createDataset(@Body() createDatasetDto: CreateDatasetDto, @UploadedFile() file: Express.Multer.File, @UserId() managerId: string) {
    return this.datasetsService.createDataset(createDatasetDto, managerId);
  }

  @Delete(':id/:column')
  @RouteAccess({ role: 'standard' })
  deleteColumn(@Param('id', ParseIdPipe) id: ObjectId, @Param('column') column?: string) {
    return this.datasetsService.deleteColumn(id, column);
  }

  @Delete(':id')
  @RouteAccess({ role: 'standard' })
  deleteDataset(@Param('id', ParseIdPipe) id: ObjectId) {
    return this.datasetsService.deleteDataset(id);
  }

  @ApiOperation({ summary: 'Get All Datasets' })
  @Get('available')
  @RouteAccess({ role: 'standard' })
  getAvailable(@Query('owner', new ParseIdPipe({ isOptional: true })) ownerId?: string): Promise<DatasetInfo[]> {
    return this.datasetsService.getAvailable(ownerId);
  }

  @ApiOperation({ summary: 'Get All Info and Data for Dataset' })
  @Get(':id')
  @RouteAccess({ role: 'standard' })
  getById(@Param('id', ParseIdPipe) id: ObjectId) {
    return this.datasetsService.getById(id);
  }

  @Patch(':id/:column')
  @RouteAccess({ role: 'standard' })
  updateColumn(
    @Body() dto: UpdateDatasetColumnDto,
    @Param('id', ParseIdPipe) id: ObjectId,
    @Param('column') column?: string
  ) {
    return this.datasetsService.updateColumn(dto, id, column);
  }
}

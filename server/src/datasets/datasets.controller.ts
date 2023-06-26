import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { DatasetInfo } from '@databank/types';
import { type ObjectId } from 'mongoose';

import { DatasetsService } from './datasets.service.js';
import { CreateDatasetDto } from './dto/create-dataset.dto.js';
import { UpdateDatasetColumnDto } from './dto/dataset-column.dto.js';

import { UserId } from '@/core/decorators/user-id.decorator.js';
import { ParseIdPipe } from '@/core/pipes/parse-id.pipe.js';

@ApiTags('Datasets')
@Controller({ path: 'datasets' })
export class DatasetsController {
  constructor(private readonly datasetsService: DatasetsService) {}

  @ApiOperation({ summary: 'Create Dataset' })
  @Post()
  createDataset(@Body() createDatasetDto: CreateDatasetDto, @UserId() ownerId: ObjectId) {
    return this.datasetsService.createDataset(createDatasetDto, ownerId);
  }

  @ApiOperation({ summary: 'Get All Datasets' })
  @Get('available')
  getAvailable(@Query('owner', new ParseIdPipe({ isOptional: true })) ownerId?: string): Promise<DatasetInfo[]> {
    return this.datasetsService.getAvailable(ownerId);
  }

  @ApiOperation({ summary: 'Get All Info and Data for Dataset' })
  @Get(':id')
  getById(@Param('id', ParseIdPipe) id: ObjectId) {
    return this.datasetsService.getById(id);
  }

  @Delete(':id')
  deleteDataset(@Param('id', ParseIdPipe) id: ObjectId) {
    return this.datasetsService.deleteDataset(id);
  }

  @Patch(':id/:column')
  updateColumn(
    @Body() dto: UpdateDatasetColumnDto,
    @Param('id', ParseIdPipe) id: ObjectId,
    @Param('column') column?: string
  ) {
    return this.datasetsService.updateColumn(dto, id, column);
  }

  @Delete(':id/:column')
  deleteColumn(@Param('id', ParseIdPipe) id: ObjectId, @Param('column') column?: string) {
    return this.datasetsService.deleteColumn(id, column);
  }
}

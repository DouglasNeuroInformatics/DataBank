import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { DatasetInfo } from '@databank/types';
import { type ObjectId } from 'mongoose';

import { DatasetsService } from './datasets.service.js';
import { CreateDatasetDto } from './dto/create-dataset.dto.js';

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
  getById(@Param('id', ParseIdPipe) id: string) {
    return this.datasetsService.getById(id);
  }
}

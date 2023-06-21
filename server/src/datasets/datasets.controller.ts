import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { DatasetInfo } from '@databank/types';

import { DatasetsService } from './datasets.service.js';
import { CreateDatasetDto } from './dto/create-dataset.dto.js';

import { ParseIdPipe } from '@/core/pipes/parse-id.pipe.js';

@ApiTags('Datasets')
@Controller({ path: 'datasets' })
export class DatasetsController {
  constructor(private readonly datasetsService: DatasetsService) {}

  @ApiOperation({ summary: 'Create Dataset' })
  @Post()
  createDataset(@Body() createDatasetDto: CreateDatasetDto) {
    return this.datasetsService.createDataset(createDatasetDto);
  }

  @ApiOperation({ summary: 'Get All Datasets' })
  @Get('available')
  getAvailable(): Promise<DatasetInfo[]> {
    return this.datasetsService.getAvailable();
  }

  @ApiOperation({ summary: 'Get All Info and Data for Dataset' })
  @Get(':id')
  getById(@Param('id', ParseIdPipe) id: string) {
    return this.datasetsService.getById(id);
  }
}

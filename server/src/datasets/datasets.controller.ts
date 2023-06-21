import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { DatasetsService } from './datasets.service.js';
import { CreateDatasetDto } from './dto/create-dataset.dto.js';

@ApiTags('Datasets')
@Controller({ path: 'datasets' })
export class DatasetsController {
  constructor(private readonly datasetsService: DatasetsService) {}

  @ApiOperation({ summary: 'Create Dataset' })
  @Post()
  createDataset(@Body() createDatasetDto: CreateDatasetDto) {
    return this.datasetsService.createDataset(createDatasetDto);
  }

  @ApiOperation({ summary: 'Get All' })
  @Get()
  getAll() {
    return;
  }

  @ApiOperation({ summary: 'Get For User' })
  @Get()
  getForUser() {
    return this.datasetsService.getForUser();
  }
}

/* eslint-disable perfectionist/sort-classes */
import type { ColumnDataType, DatasetViewPaginationDto, EditDatasetInfoDto, PermissionLevel } from '@databank/types';
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

  @ApiOperation({ summary: 'Add Manager to Dataset' })
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

  @ApiOperation({ summary: 'Delete Dataset' })
  @Delete(':id')
  @RouteAccess({ role: 'STANDARD' })
  deleteDataset(@Param('id', ParseObjectIdPipe) datasetId: string, @CurrentUser('id') currentUserId: string) {
    return this.datasetsService.deleteDataset(datasetId, currentUserId);
  }

  @ApiOperation({ summary: 'Get all Public Datasets' })
  @RouteAccess('public')
  @Get('public')
  getPublic() {
    return this.datasetsService.getPublic();
  }

  @ApiOperation({ summary: 'Get One Public Dataset by Id' })
  @RouteAccess('public')
  @Post('public/:id')
  getOnePublicById(
    @Param('id') datasetId: string,
    @Body('rowPaginationDto') rowPaginationDto: DatasetViewPaginationDto,
    @Body('columnPaginationDto') columnPaginationDto: DatasetViewPaginationDto
  ) {
    return this.datasetsService.getOnePublicById(datasetId, rowPaginationDto, columnPaginationDto);
  }

  @ApiOperation({ summary: 'Download Public Dataset Data' })
  @Get('public/download-data/:id/:format')
  @RouteAccess('public')
  downloadPublicDataById(@Param('id') datasetId: string, @Param('format') format: 'CSV' | 'TSV') {
    return this.datasetsService.downloadPublicDataById(datasetId, format);
  }

  @ApiOperation({ summary: 'Download Public Dataset Metadata' })
  @Get('public/download-metadata/:id/:format')
  @RouteAccess('public')
  downloadPublicMetadataById(@Param('id') datasetId: string, @Param('format') format: 'CSV' | 'TSV') {
    return this.datasetsService.downloadPublicMetadataById(datasetId, format);
  }

  @ApiOperation({ summary: 'Get All Available Datasets' })
  @Get()
  @RouteAccess({ role: 'STANDARD' })
  getAvailable(@CurrentUser('id') currentUserId: string) {
    return this.datasetsService.getAvailable(currentUserId);
  }

  @ApiOperation({ summary: 'Get All Available Datasets Owned By the Current Manager' })
  @Get('owned-by')
  @RouteAccess({ role: 'STANDARD' })
  getAllByManagerId(@CurrentUser('id') currentUserId: string) {
    return this.datasetsService.getAllByManagerId(currentUserId);
  }

  @ApiOperation({ summary: 'Get All columns given the dataset id' })
  @Get('columns/:id')
  @RouteAccess({ role: 'STANDARD' })
  getColumnsById(@Param('id') datasetId: string, @CurrentUser('id') currentUserId: string) {
    return this.datasetsService.getColumnsById(datasetId, currentUserId);
  }

  @ApiOperation({ summary: 'Get the View of a Dataset' })
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

  @ApiOperation({ summary: 'Download Dataset Data' })
  @Get('/download-data/:id/:format')
  @RouteAccess({ role: 'STANDARD' })
  downloadDataById(
    @Param('id') datasetId: string,
    @CurrentUser('id') currentUserId: string,
    @Param('format') format: 'CSV' | 'TSV'
  ) {
    return this.datasetsService.downloadDataById(datasetId, currentUserId, format);
  }

  @ApiOperation({ summary: 'Download Dataset Metadata' })
  @Get('/download-metadata/:id/:format')
  @RouteAccess({ role: 'STANDARD' })
  downloadMetadataById(
    @Param('id') datasetId: string,
    @CurrentUser('id') currentUserId: string,
    @Param('format') format: 'CSV' | 'TSV'
  ) {
    return this.datasetsService.downloadMetadataById(datasetId, currentUserId, format);
  }

  @ApiOperation({ summary: 'Remove Manager from Dataset' })
  @Delete('managers/:id/:managerIdToRemove')
  @RouteAccess({ role: 'STANDARD' })
  removeManager(
    @Param('id') datasetId: string,
    @CurrentUser('id') managerId: string,
    @Param('managerIdToRemove') managerIdToRemove: string
  ) {
    return this.datasetsService.removeManager(datasetId, managerId, managerIdToRemove);
  }

  @ApiOperation({ summary: 'Set Dataset Ready to Share' })
  @Patch('share/:id')
  @RouteAccess({ role: 'STANDARD' })
  setReadyToShare(@Param('id') datasetId: string, @CurrentUser('id') managerId: string) {
    return this.datasetsService.setReadyToShare(datasetId, managerId);
  }

  @ApiOperation({ summary: 'Edit Dataset Information' })
  @Patch('info/:id')
  @RouteAccess({ role: 'STANDARD' })
  editDatasetInfo(
    @Param('id') datasetId: string,
    @CurrentUser('id') managerId: string,
    @Body('editDatasetInfoDto') editDatasetInfoDto: EditDatasetInfoDto
  ) {
    return this.datasetsService.editDatasetInfo(datasetId, managerId, editDatasetInfoDto);
  }

  @Patch('/column-data-permission/:id/:columnId')
  @RouteAccess({ role: 'STANDARD' })
  changeColumnDataPermission(
    @Param('id') datasetId: string,
    @Param('columnId') columnId: string,
    @CurrentUser('id') userId: string,
    @Body('newPermissionLevel') newPermissionLevel: PermissionLevel
  ) {
    return this.datasetsService.changeColumnDataPermission(datasetId, columnId, userId, newPermissionLevel);
  }

  @Patch('/column-metadata-permission/:id/:columnId')
  @RouteAccess({ role: 'STANDARD' })
  changeColumnMetadataPermission(
    @Param('id') datasetId: string,
    @Param('columnId') columnId: string,
    @CurrentUser('id') userId: string,
    @Body('newPermissionLevel') newPermissionLevel: PermissionLevel
  ) {
    return this.datasetsService.changeColumnMetadataPermission(datasetId, columnId, userId, newPermissionLevel);
  }

  @Delete('/column/:id/:columnId')
  @RouteAccess({ role: 'STANDARD' })
  deleteColumnById(
    @Param('id') datasetId: string,
    @Param('columnId') columnId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.datasetsService.deleteColumnById(datasetId, columnId, userId);
  }

  @Patch('/column-type/:id/:columnId')
  @RouteAccess({ role: 'STANDARD' })
  mutateColumnType(
    @Param('id') datasetId: string,
    @Param('columnId') columnId: string,
    @CurrentUser('id') userId: string,
    @Body('type') columnType: ColumnDataType
  ) {
    return this.datasetsService.mutateColumnType(datasetId, columnId, userId, columnType);
  }

  @Patch('column-nullable/:id/:columnId')
  @RouteAccess({ role: 'STANDARD' })
  toggleColumnNullable(
    @Param('id') datasetId: string,
    @Param('columnId') columnId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.datasetsService.toggleColumnNullable(datasetId, columnId, userId);
  }
}

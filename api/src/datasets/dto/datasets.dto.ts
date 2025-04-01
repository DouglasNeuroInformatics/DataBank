import {
  $ColumnDataType,
  $CreateDataset,
  $DatasetViewPagination,
  $EditDatasetInfo,
  $PermissionLevel
} from '@databank/core';
import type {
  ColumnDataType,
  CreateDataset,
  DatasetViewPagination,
  EditDatasetInfo,
  PermissionLevel
} from '@databank/core';
import { DataTransferObject } from '@douglasneuroinformatics/libnest';

class DatasetViewPaginationDto extends DataTransferObject($DatasetViewPagination) implements DatasetViewPagination {}

// TO-DO:

class CreateDatasetDto extends DataTransferObject($CreateDataset) implements CreateDataset {}

class EditDatasetInfoDto extends DataTransferObject($EditDatasetInfo) implements EditDatasetInfo {}

class PermissionLevelDto extends DataTransferObject($PermissionLevel) implements PermissionLevel {}

class ColumnDataTypeDto extends DataTransferObject($ColumnDataType) implements ColumnDataType {}

export { ColumnDataTypeDto, CreateDatasetDto, DatasetViewPaginationDto, EditDatasetInfoDto, PermissionLevelDto };

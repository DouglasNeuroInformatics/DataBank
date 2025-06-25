import {
  $ColumnType,
  $CreateDataset,
  $DatasetViewPagination,
  $EditDatasetInfo,
  $PermissionLevel
} from '@databank/core';
import type { CreateDataset, DatasetViewPagination, EditDatasetInfo, PermissionLevel } from '@databank/core';
import { DataTransferObject, ValidationSchema } from '@douglasneuroinformatics/libnest';
import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

class DatasetViewPaginationDto extends DataTransferObject($DatasetViewPagination) implements DatasetViewPagination {}

class CreateDatasetDto extends DataTransferObject($CreateDataset) implements CreateDataset {}

class EditDatasetInfoDto extends DataTransferObject($EditDatasetInfo) implements EditDatasetInfo {}

const $PermissionLevelObj = z.object({
  permission: $PermissionLevel
});
type PermissionLevelObj = z.infer<typeof $PermissionLevelObj>;

@ValidationSchema($PermissionLevelObj)
class PermissionLevelDto implements PermissionLevelObj {
  @ApiProperty()
  permission: PermissionLevel;
}

const $ColumnDataDto = z.object({
  kind: $ColumnType
});
type ColumnDataDto = z.infer<typeof $ColumnDataDto>;
class ColumnDataTypeDto extends DataTransferObject($ColumnDataDto) implements ColumnDataDto {}

export { ColumnDataTypeDto, CreateDatasetDto, DatasetViewPaginationDto, EditDatasetInfoDto, PermissionLevelDto };

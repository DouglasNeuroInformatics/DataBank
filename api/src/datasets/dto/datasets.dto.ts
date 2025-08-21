import { $ColumnType, $PermissionLevel } from '@databank/core';
import z from 'zod/v4';

const $PermissionLevelObj = z.object({
  permission: $PermissionLevel
});
type $PermissionLevelObj = z.infer<typeof $PermissionLevelObj>;

const $ColumnDataType = z.object({
  kind: $ColumnType
});
type $ColumnDataType = z.infer<typeof $ColumnDataType>;

export { $ColumnDataType, $PermissionLevelObj };

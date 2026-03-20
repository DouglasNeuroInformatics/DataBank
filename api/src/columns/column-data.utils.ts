import type { $ColumnType } from '@databank/core';
import type { PermissionLevel } from '@prisma/client';

interface ColumnWithData {
  datetimeData: { value: unknown }[];
  enumData: { value: unknown }[];
  floatData: { value: unknown }[];
  intData: { value: unknown }[];
  kind: $ColumnType;
  stringData: { value: unknown }[];
}

const COLUMN_DATA_KEY = {
  DATETIME: 'datetimeData',
  ENUM: 'enumData',
  FLOAT: 'floatData',
  INT: 'intData',
  STRING: 'stringData'
} as const;

function getColumnDataArray(column: ColumnWithData): { value: unknown }[] {
  return column[COLUMN_DATA_KEY[column.kind]];
}

const PERMISSION_RANK: { [K in PermissionLevel]: number } = {
  LOGIN: 1,
  MANAGER: 3,
  PUBLIC: 0,
  VERIFIED: 2
};

function shouldHideData(userStatus: PermissionLevel, columnPermission: PermissionLevel): boolean {
  return PERMISSION_RANK[userStatus] < PERMISSION_RANK[columnPermission];
}

export { COLUMN_DATA_KEY, getColumnDataArray, shouldHideData };

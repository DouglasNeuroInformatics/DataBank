import { z } from 'zod';

import {
  $DatetimeColumnSummary,
  $EnumColumnSummary,
  $FloatColumnSummary,
  $IntColumnSummary,
  $TabularColumnInfo
} from './columns';

//===================== Project Column Transformation ========================
const $ProjectRowFilter = z.object({
  rowMax: z.number().int().nullable(),
  rowMin: z.number().int().gte(0).default(0).nullable()
});
type ProjectRowFilter = z.infer<typeof $ProjectRowFilter>;

const $ProjectColumnHash = z.object({
  length: z.number().int().nullable(),
  salt: z.string()
});
type ProjectColumnHash = z.infer<typeof $ProjectColumnHash>;

const $ProjectColumnTrim = z.object({
  end: z.number().int().nullable(),
  start: z.number().int().nullable()
});
type ProjectColumnTrim = z.infer<typeof $ProjectColumnTrim>;

const $ProjectColumnTransformation = z.object({
  columnId: z.string(),
  hash: $ProjectColumnHash.nullable(),
  trim: $ProjectColumnTrim.nullable()
});
type ProjectColumnTransformation = z.infer<typeof $ProjectColumnTransformation>;

//===================== Project Dataset ========================
const $ProjectDataset = z.object({
  columns: $ProjectColumnTransformation.array(),
  datasetId: z.string(),
  dataTypeFilters: z.enum(['INT', 'FLOAT', 'STRING', 'ENUM', 'DATETIME']).array(),
  rowFilter: $ProjectRowFilter.nullable(),
  useDataTypeFilter: z.boolean(),
  useRowFilter: z.boolean()
});
type ProjectDataset = z.infer<typeof $ProjectDataset>;

//===================== Create Project ========================
const $CreateProject = z.object({
  datasets: $ProjectDataset.array(),
  description: z.string().optional(),
  expiry: z.coerce.date(),
  externalId: z.string().optional(),
  name: z.string().min(1),
  userIds: z.string().array().min(1)
});
type CreateProject = z.infer<typeof $CreateProject>;

//===================== Update Project ========================
const $UpdateProject = $CreateProject.partial();
type UpdateProject = z.infer<typeof $UpdateProject>;

//===================== Project Column ========================
const $ProjectColumnInfo = $TabularColumnInfo.omit({
  dataPermission: true,
  summaryPermission: true,
  tabularDataId: true
});

const $ProjectStringColumn = z.object({
  kind: z.literal('STRING')
});
type ProjectStringColumn = z.infer<typeof $ProjectStringColumn>;

const $ProjectIntColumn = z.object({
  intSummary: $IntColumnSummary,
  kind: z.literal('INT')
});
type ProjectIntColumn = z.infer<typeof $ProjectIntColumn>;

const $ProjectFloatColumn = z.object({
  floatSummary: $FloatColumnSummary,
  kind: z.literal('FLOAT')
});
type ProjectFloatColumn = z.infer<typeof $ProjectFloatColumn>;

const $ProjectEnumColumn = z.object({
  enumSummary: $EnumColumnSummary,
  kind: z.literal('ENUM')
});
type ProjectEnumColumn = z.infer<typeof $ProjectEnumColumn>;

const $ProjectDatetimeColumn = z.object({
  datetimeSummary: $DatetimeColumnSummary,
  kind: z.literal('DATETIME')
});
type ProjectDatetimeColumn = z.infer<typeof $ProjectDatetimeColumn>;

const $ProjectColumn = z
  .union([$ProjectStringColumn, $ProjectIntColumn, $ProjectFloatColumn, $ProjectDatetimeColumn, $ProjectEnumColumn])
  .and($ProjectColumnInfo);
type ProjectColumn = z.infer<typeof $ProjectColumn>;

//===================== Project Dataset Column View ========================
const $GetColumnViewDto = $ProjectColumnTransformation.and($ProjectRowFilter);
type GetColumnViewDto = z.infer<typeof $GetColumnViewDto>;

export {
  $CreateProject,
  $GetColumnViewDto,
  $ProjectColumn,
  $ProjectColumnHash,
  $ProjectColumnInfo,
  $ProjectColumnTransformation,
  $ProjectColumnTrim,
  $ProjectDataset,
  $ProjectDatetimeColumn,
  $ProjectEnumColumn,
  $ProjectFloatColumn,
  $ProjectIntColumn,
  $ProjectRowFilter,
  $ProjectStringColumn,
  $UpdateProject
};

export type {
  CreateProject,
  GetColumnViewDto,
  ProjectColumn,
  ProjectColumnHash,
  ProjectColumnTransformation,
  ProjectColumnTrim,
  ProjectDataset,
  ProjectDatetimeColumn,
  ProjectEnumColumn,
  ProjectFloatColumn,
  ProjectIntColumn,
  ProjectRowFilter,
  ProjectStringColumn,
  UpdateProject
};

import { DatasetLicense, PermissionLevel } from '@prisma/client';
import { z } from 'zod';

// ---------------------- Column Summaries ---------------------
const $BaseSummary = z.object({
  count: z.number().int()
});
type BaseSummary = z.infer<typeof $BaseSummary>;

const $IntSummary = $BaseSummary.extend({
  max: z.number().int(),
  mean: z.number(),
  median: z.number(),
  min: z.number().int(),
  mode: z.number().int(),
  std: z.number()
});
type IntSummary = z.infer<typeof $IntSummary>;

const $FloatSummary = $BaseSummary.extend({
  max: z.number(),
  mean: z.number(),
  median: z.number(),
  min: z.number(),
  std: z.number()
});
type FloatSummary = z.infer<typeof $FloatSummary>;

const $EnumSummary = $BaseSummary.extend({
  distribution: z.record(z.number().int())
});
type EnumSummary = z.infer<typeof $EnumSummary>;

const $DatetimeSummary = $BaseSummary.extend({
  max: z.date(),
  min: z.date()
});
type DatetimeSummary = z.infer<typeof $DatetimeSummary>;

export const $ColumnSummary = z.union([
  $BaseSummary,
  $IntSummary,
  $FloatSummary,
  $EnumSummary,
  $DatetimeSummary
]) satisfies z.ZodType<ColumnSummary>;
export type ColumnSummary = BaseSummary | DatetimeSummary | EnumSummary | FloatSummary | IntSummary;
// ----------------------- Column Validation -----------------------
// const $StringColumnValidation = z.object({
//   max: z.number().int(),
//   mean: z.number(),
//   median: z.number(),
//   min: z.number().int(),
//   mode: z.number().int(),
//   std: z.number()
// });

// const $NumericColumnValidation = z.object({
//   max: z.number().int(),
//   min: z.number().int()
// });

// export const $EnumColumnValidation = z.object({
//   allowedValues: z.string().array()
// });

// export const $DatetimeValidation = z.object({
//   max: z.date(),
//   min: z.date()
//   // pass ISO
// });

// ---------------------------------------------------
const $PermissionLevel: Zod.ZodType<PermissionLevel> = z.enum(['PUBLIC', 'LOGIN', 'VERIFIED', 'MANAGER']);

const $TabularColumnInfo = z.object({
  dataPermission: $PermissionLevel,
  description: z.string().optional(),
  id: z.string(),
  name: z.string(),
  nullable: z.boolean(),
  summaryPermission: $PermissionLevel,
  tabularDataId: z.string()
});

const $StringColumn = $TabularColumnInfo.extend({
  columnType: z.literal('STRING'),
  stringData: z.string().array(),
  summary: $BaseSummary
});

type StringColumn = z.infer<typeof $StringColumn>;

const $IntColumn = $TabularColumnInfo.extend({
  columnType: z.literal('INT'),
  stringData: z.string().array(),
  summary: $IntSummary
});
export type IntColumn = z.infer<typeof $IntColumn>;

const $FloatColumn = $TabularColumnInfo.extend({
  columnType: z.literal('FLOAT'),
  stringData: z.string().array(),
  summary: $FloatSummary
});
export type FloatColumn = z.infer<typeof $FloatColumn>;

const $EnumColumn = $TabularColumnInfo.extend({
  columnType: z.literal('ENUM'),
  enumData: z.string().array(),
  summary: $EnumSummary
});
type EnumColumn = z.infer<typeof $EnumColumn>;

const $DatetimeColumn = $TabularColumnInfo.extend({
  columnType: z.literal('DATETIME'),
  datetimeData: z.date().array(),
  summary: $DatetimeSummary
});
type DatetimeColumn = z.infer<typeof $DatetimeColumn>;

export const $TabularColumn = z.union([
  $StringColumn,
  $IntColumn,
  $FloatColumn,
  $EnumColumn,
  $DatetimeColumn
]) satisfies z.ZodType<TabularColumn>;
export type TabularColumn = DatetimeColumn | EnumColumn | FloatColumn | IntColumn | StringColumn;

const $License: Zod.ZodType<DatasetLicense> = z.enum(['PUBLIC', 'OTHER']);

// ------------------ Dataset ----------------------
const $DatasetInfo = z.object({
  createdAt: z.coerce.date(),
  description: z.string().optional(),
  id: z.string(),
  license: $License,
  managerIds: z.string().array().min(1),
  name: z.string(),
  updatedAt: z.coerce.date()
});
// export type DatasetInfo = z.infer<typeof $DatasetInfo>;

const $BaseDatasetModel = $DatasetInfo.extend({
  datasetType: z.literal('BASE')
});
type BaseDatasetModel = z.infer<typeof $BaseDatasetModel>;

const $TabularData = z.object({
  columns: z.array($TabularColumn),
  datasetId: z.string(),
  id: z.string(),
  primaryKeys: z.string().array()
});

const $TabularDatasetModel = $DatasetInfo.extend({
  datasetType: z.literal('TABULAR'),
  tabularData: $TabularData
});
type TabularDatasetModel = z.infer<typeof $TabularDatasetModel>;

export const $DatasetModel = z.union([$BaseDatasetModel, $TabularDatasetModel]) satisfies z.ZodType<DatasetModel>;
export type DatasetModel = BaseDatasetModel | TabularDatasetModel;

// --------------- DTO --------------------------
const $CreateTabularDatasetDto = $DatasetInfo
  .omit({
    createdAt: true,
    id: true,
    managerIDs: true,
    updatedAt: true
  })
  .extend({
    datasetType: z.literal('TABULAR'),
    primaryKeys: z.string().array()
  });

export type CreateTabularDatasetDto = z.infer<typeof $CreateTabularDatasetDto>;

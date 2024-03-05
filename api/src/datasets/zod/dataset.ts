import { DatasetLicense, PermissionLevel } from '@prisma/client';
import { z } from 'zod';

// ---------------------- Column Summaries ---------------------
export const $BaseSummary = z.object({
  count: z.number().int()
});

export const $IntSummary = $BaseSummary.extend({
  max: z.number().int(),
  mean: z.number(),
  median: z.number(),
  min: z.number().int(),
  mode: z.number().int(),
  std: z.number()
});

export const $FloatSummary = $BaseSummary.extend({
  max: z.number(),
  mean: z.number(),
  median: z.number(),
  min: z.number(),
  std: z.number()
});

export const $EnumSummary = $BaseSummary.extend({
  distribution: z.record(z.number().int())
});

export const $DatetimeSummary = $BaseSummary.extend({
  max: z.date(),
  min: z.date()
});

// ----------------------- Column Validation -----------------------
export const $StringColumnValidation = z.object({
  max: z.number().int(),
  mean: z.number(),
  median: z.number(),
  min: z.number().int(),
  mode: z.number().int(),
  std: z.number()
});

export const $NumericColumnValidation = z.object({
  max: z.number().int(),
  min: z.number().int()
});

export const $EnumColumnValidation = z.object({
  allowedValues: z.string().array()
});

export const $DatetimeValidation = z.object({
  max: z.date(),
  min: z.date()
  // pass ISO
});

// ---------------------------------------------------
export const $TabularColumnInfo = z.object({
  dataPermission: z.nativeEnum(PermissionLevel),
  description: z.string().optional(),
  id: z.string(),
  name: z.string(),
  nullable: z.boolean(),
  summaryPermission: z.nativeEnum(PermissionLevel),
  tabularDataId: z.string()
});

export const $StringColumn = $TabularColumnInfo.extend({
  columnType: z.literal('STRING'),
  stringData: z.string().array(),
  summary: $BaseSummary
});

export type StringColumn = z.infer<typeof $StringColumn>;

export const $IntColumn = $TabularColumnInfo.extend({
  columnType: z.literal('INT'),
  stringData: z.string().array(),
  summary: $IntSummary
});
export type IntColumn = z.infer<typeof $IntColumn>;

export const $FloatColumn = $TabularColumnInfo.extend({
  columnType: z.literal('FLOAT'),
  stringData: z.string().array(),
  summary: $FloatSummary
});
export type FloatColumn = z.infer<typeof $FloatColumn>;

export const $EnumColumn = $TabularColumnInfo.extend({
  columnType: z.literal('ENUM'),
  enumData: z.string().array(),
  summary: $EnumSummary
});
export type EnumColumn = z.infer<typeof $EnumColumn>;

export const $DatetimeColumn = $TabularColumnInfo.extend({
  columnType: z.literal('DATETIME'),
  datetimeData: z.date().array(),
  summary: $DatetimeSummary
});
export type DatetimeColumn = z.infer<typeof $DatetimeColumn>;

export const $TabularColumn = z.discriminatedUnion('columnType', [
  $StringColumn,
  $IntColumn,
  $FloatColumn,
  $EnumColumn,
  $DatetimeColumn
]);
export type TabularColumn = z.infer<typeof $TabularColumn>;

// ------------------ Dataset ----------------------
export const $DatasetInfo = z.object({
  createdAt: z.coerce.date(),
  description: z.string().optional(),
  id: z.string(),
  license: z.nativeEnum(DatasetLicense),
  managerIDs: z.string().array(),
  name: z.string(),
  updatedAt: z.coerce.date()
});
export type DatasetInfo = z.infer<typeof $DatasetInfo>;

export const $BaseDatasetModel = $DatasetInfo.extend({
  datasetType: z.literal('BASE')
});

export const $TabularData = z.object({
  columns: z.array($TabularColumn),
  datasetId: z.string(),
  id: z.string(),
  primaryKeys: z.string().array()
});

export const $TabularDatasetModel = $DatasetInfo.extend({
  datasetType: z.literal('TABULAR'),
  tabularData: $TabularData
});

export const $DatasetModel = z.discriminatedUnion('datasetType', [$BaseDatasetModel, $TabularDatasetModel]);
export type DatasetModel = z.infer<typeof $DatasetModel>;
// --------------- DTO --------------------------
export const $CreateTabularDatasetDto = $DatasetInfo
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

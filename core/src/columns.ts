import type { JsonValue } from 'type-fest';
import { z } from 'zod';

import { $PermissionLevel } from './datasets';

// ---------------------- Column Summaries ---------------------
type BaseColumnSummary = {
  count: number;
  nullCount: number;
};

type StringColumnSummary = {
  kind: { type: 'STRING' };
};

type IntColumnSummary = {
  kind: { type: 'INT' };
  max?: number;
  mean?: number;
  median?: number;
  min?: number;
  mode?: number;
  std?: number;
};

type FloatColumnSummary = {
  kind: { type: 'FLOAT' };
  max?: number;
  mean?: number;
  median?: number;
  min?: number;
  std?: number;
};

type BooleanColumnSummary = {
  kind: { type: 'BOOLEAN' };
  trueCount: number;
};

type EnumColumnSummary = {
  distribution?: JsonValue;
  kind: { type: 'ENUM' };
};

type DatetimeColumnSummary = {
  kind: { type: 'DATETIME' };
  max: Date;
  min: Date;
};

type ColumnSummary = BaseColumnSummary &
  (
    | BooleanColumnSummary
    | DatetimeColumnSummary
    | EnumColumnSummary
    | FloatColumnSummary
    | IntColumnSummary
    | StringColumnSummary
  );

const $BaseSummary = z.object({
  count: z.number().int(),
  nullCount: z.number().int()
});
// type BaseSummary = z.infer<typeof $BaseSummary>;

const $IntSummary = $BaseSummary.extend({
  max: z.number().int(),
  mean: z.number(),
  median: z.number(),
  min: z.number().int(),
  mode: z.number().int(),
  std: z.number()
});
// type IntSummary = z.infer<typeof $IntSummary>;

const $FloatSummary = $BaseSummary.extend({
  max: z.number(),
  mean: z.number(),
  median: z.number(),
  min: z.number(),
  std: z.number()
});
// type FloatSummary = z.infer<typeof $FloatSummary>;

const $EnumSummary = $BaseSummary.extend({
  distribution: z.record(z.number().int())
});
// type EnumSummary = z.infer<typeof $EnumSummary>;

const $DatetimeSummary = $BaseSummary.extend({
  max: z.date(),
  min: z.date()
});
// type DatetimeSummary = z.infer<typeof $DatetimeSummary>;

// const $ColumnSummary = z.union([
//   $BaseSummary,
//   $IntSummary,
//   $FloatSummary,
//   $EnumSummary,
//   $DatetimeSummary
// ]) satisfies z.ZodType<ColumnSummary>;
// type ColumnSummary = BaseSummary | DatetimeSummary | EnumSummary | FloatSummary | IntSummary;

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
  kind: z.object({ type: z.literal('STRING') }),
  stringData: z.array(
    z.object({
      value: z.string().optional()
    })
  ),
  summary: $BaseSummary
});
type StringColumn = z.infer<typeof $StringColumn>;

const $CreateStringColumn = $StringColumn.omit({
  id: true
});
type CreateStringColumn = z.infer<typeof $CreateStringColumn>;

const $UpdateStringColumn = $CreateStringColumn.partial();
type UpdateStringColumn = z.infer<typeof $UpdateStringColumn>;

const $IntColumn = $TabularColumnInfo.extend({
  intData: z.array(
    z.object({
      value: z.number().optional()
    })
  ),
  kind: z.object({ type: z.literal('INT') }),
  summary: $IntSummary
});
type IntColumn = z.infer<typeof $IntColumn>;

const $CreateIntColumn = $IntColumn.omit({
  id: true
});
type CreateIntColumn = z.infer<typeof $CreateIntColumn>;

const $UpdateIntColumn = $CreateIntColumn.partial();
type UpdateIntColumn = z.infer<typeof $UpdateIntColumn>;

const $FloatColumn = $TabularColumnInfo.extend({
  floatData: z.array(
    z.object({
      value: z.number().optional()
    })
  ),
  kind: z.object({ type: z.literal('FLOAT') }),
  summary: $FloatSummary
});
type FloatColumn = z.infer<typeof $FloatColumn>;

const $CreateFloatColumn = $FloatColumn.omit({
  id: true
});
type CreateFloatColumn = z.infer<typeof $CreateFloatColumn>;

const $UpdateFloatColumn = $CreateFloatColumn.partial();
type UpdateFloatColumn = z.infer<typeof $UpdateFloatColumn>;

const $EnumColumn = $TabularColumnInfo.extend({
  enumData: z.array(
    z.object({
      value: z.string().optional()
    })
  ),
  kind: z.object({ type: z.literal('ENUM') }),
  summary: $EnumSummary
});
type EnumColumn = z.infer<typeof $EnumColumn>;

const $CreateEnumColumn = $EnumColumn.omit({
  id: true
});
type CreateEnumColumn = z.infer<typeof $CreateEnumColumn>;

const $UpdateEnumColumn = $CreateEnumColumn.partial();
type UpdateEnumColumn = z.infer<typeof $UpdateEnumColumn>;

const $DatetimeColumn = $TabularColumnInfo.extend({
  datetimeData: z.array(
    z.object({
      value: z.date().optional()
    })
  ),
  kind: z.object({ type: z.literal('DATETIME') }),
  summary: $DatetimeSummary
});
type DatetimeColumn = z.infer<typeof $DatetimeColumn>;

const $BooleanColumn = $TabularColumnInfo.extend({
  booleanData: z.array(
    z.object({
      value: z.boolean().optional()
    })
  ),
  kind: z.object({ type: z.literal('BOOLEAN') }),
  summary: $EnumSummary
});
type BooleanColumn = z.infer<typeof $BooleanColumn>;

const $CreateDatetimeColumn = $DatetimeColumn.omit({
  id: true
});
type CreateDatetimeColumn = z.infer<typeof $CreateDatetimeColumn>;

const $UpdateDatetimeColumn = $CreateDatetimeColumn.partial();
type UpdateDatetimeColumn = z.infer<typeof $UpdateDatetimeColumn>;

const $TabularColumn = z.union([
  $StringColumn,
  $IntColumn,
  $FloatColumn,
  $EnumColumn,
  $DatetimeColumn,
  $BooleanColumn
]) satisfies z.ZodType<TabularColumn>;
type TabularColumn = BooleanColumn | DatetimeColumn | EnumColumn | FloatColumn | IntColumn | StringColumn;

const $CreateTabularColumn = z.union([
  $CreateStringColumn,
  $CreateIntColumn,
  $CreateFloatColumn,
  $CreateEnumColumn,
  $CreateDatetimeColumn
]) satisfies z.ZodType<CreateTabularColumn>;

type CreateTabularColumn =
  | CreateDatetimeColumn
  | CreateEnumColumn
  | CreateFloatColumn
  | CreateIntColumn
  | CreateStringColumn;

type UpdateTabularColumn =
  | UpdateDatetimeColumn
  | UpdateEnumColumn
  | UpdateFloatColumn
  | UpdateIntColumn
  | UpdateStringColumn;

export {
  // $ColumnSummary,
  $CreateDatetimeColumn,
  $CreateEnumColumn,
  $CreateFloatColumn,
  $CreateTabularColumn,
  $DatetimeColumn,
  $EnumColumn,
  $FloatColumn,
  $IntColumn,
  $TabularColumn,
  $UpdateDatetimeColumn,
  $UpdateEnumColumn,
  $UpdateFloatColumn,
  $UpdateIntColumn,
  $UpdateStringColumn
};

export type {
  ColumnSummary,
  CreateDatetimeColumn,
  CreateEnumColumn,
  CreateFloatColumn,
  CreateIntColumn,
  CreateStringColumn,
  CreateTabularColumn,
  DatetimeColumn,
  EnumColumn,
  FloatColumn,
  IntColumn,
  StringColumn,
  TabularColumn,
  UpdateDatetimeColumn,
  UpdateEnumColumn,
  UpdateFloatColumn,
  UpdateIntColumn,
  UpdateStringColumn,
  UpdateTabularColumn
};

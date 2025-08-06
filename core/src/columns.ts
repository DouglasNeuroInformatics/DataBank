import { z } from 'zod';

const $ColumnType = z.enum(['STRING', 'INT', 'FLOAT', 'ENUM', 'DATETIME']);
type ColumnType = z.infer<typeof $ColumnType>;

const $PermissionLevel = z.enum(['PUBLIC', 'LOGIN', 'VERIFIED', 'MANAGER']);
type PermissionLevel = z.infer<typeof $PermissionLevel>;

const $BasicSummary = z.object({
  count: z.number().int().gte(0),
  nullable: z.boolean(),
  nullCount: z.number().int().gte(0)
});

const $TabularColumnInfo = z
  .object({
    dataPermission: $PermissionLevel,
    description: z.string().optional(),
    id: z.string(),
    name: z.string(),
    summaryPermission: $PermissionLevel,
    tabularDataId: z.string()
  })
  .merge($BasicSummary);
type TabularColumnInfo = z.infer<typeof $TabularColumnInfo>;

// ---------------------- Column Summaries ---------------------
const $IntSummary = z.object({
  max: z.number().int(),
  mean: z.number(),
  median: z.number(),
  min: z.number().int(),
  mode: z.number().int(),
  std: z.number()
});

const $FloatSummary = z.object({
  max: z.number(),
  mean: z.number(),
  median: z.number(),
  min: z.number(),
  std: z.number()
});

const $EnumSummary = z.object({
  distribution: z.record(z.number().int())
});

const $DatetimeSummary = z.object({
  max: z.date(),
  min: z.date()
});

const $StringColumn = z.object({
  kind: z.literal($ColumnType.Enum.STRING),
  stringData: z.array(
    z.object({
      value: z.string().optional()
    })
  )
});
type StringColumn = z.infer<typeof $StringColumn>;
const $StringColumnSummary = $StringColumn.omit({ stringData: true });

const $IntColumn = z.object({
  intData: z.array(
    z.object({
      value: z.number().optional()
    })
  ),
  intSummary: $IntSummary,
  kind: z.literal($ColumnType.Enum.INT)
});

const $IntColumnSummary = $IntColumn.omit({ intData: true });

type IntColumn = z.infer<typeof $IntColumn>;

const $FloatColumn = z.object({
  floatData: z.array(
    z.object({
      value: z.number().optional()
    })
  ),
  floatSummary: $FloatSummary,
  kind: z.literal($ColumnType.Enum.FLOAT)
});
type FloatColumn = z.infer<typeof $FloatColumn>;
const $FloatColumnSummary = $FloatColumn.omit({ floatData: true });

const $EnumColumn = z.object({
  enumData: z.array(
    z.object({
      value: z.string().optional()
    })
  ),
  enumSummary: $EnumSummary,
  kind: z.literal($ColumnType.Enum.ENUM)
});
type EnumColumn = z.infer<typeof $EnumColumn>;
const $EnumColumnSummary = $EnumColumn.omit({ enumData: true });

const $DatetimeColumn = z.object({
  datetimeData: z.array(
    z.object({
      value: z.date().optional()
    })
  ),
  datetimeSummary: $DatetimeSummary,
  kind: z.literal($ColumnType.Enum.DATETIME)
});
type DatetimeColumn = z.infer<typeof $DatetimeColumn>;

const $DatetimeColumnSummary = $DatetimeColumn.omit({ datetimeData: true });

const $TabularColumn = z
  .union([$DatetimeColumn, $IntColumn, $StringColumn, $FloatColumn, $EnumColumn])
  .and($TabularColumnInfo);
type TabularColumn = z.infer<typeof $TabularColumn>;

const $TabularColumnSummary = z
  .union([$DatetimeColumnSummary, $IntColumnSummary, $FloatColumnSummary, $EnumColumnSummary, $StringColumnSummary])
  .and($BasicSummary);
type TabularColumnSummary = z.infer<typeof $TabularColumnSummary>;

const $RawQueryColumn = z.object({
  __modelName: z.literal('TabularColumn'),
  _id: z.object({
    $oid: z.string()
  }),
  dataPermission: $PermissionLevel,
  datetimeData: z.object({ value: z.date().nullable() }).array().nullable(),
  description: z.string().nullable(),
  enumData: z.object({ value: z.string().nullable() }).array().nullable(),
  floatData: z.object({ value: z.number().nullable() }).array().nullable(),
  intData: z.object({ value: z.number().int().nullable() }).array().nullable(),
  kind: $ColumnType,
  name: z.string(),
  nullable: z.boolean(),
  // store the actual data in a pl.series(array) depending on the type of the column
  stringData: z.object({ value: z.string().nullable() }).array().nullable(),
  summary: z.object({
    count: z.number().int().gte(0),
    datetimeSummary: $DatetimeSummary.nullable(),
    enumSummary: $EnumSummary.nullable(),
    floatSummary: $FloatSummary.nullable(),
    intSummary: $IntSummary.nullable(),
    nullCount: z.number().int().gte(0)
  }),
  summaryPermission: $PermissionLevel,
  tabularDataId: z.string()
});
type RawQueryColumn = z.infer<typeof $RawQueryColumn>;

export {
  $ColumnType,
  $DatetimeColumn,
  $EnumColumn,
  $FloatColumn,
  $IntColumn,
  $PermissionLevel,
  $RawQueryColumn,
  $StringColumn,
  $TabularColumn,
  $TabularColumnInfo,
  $TabularColumnSummary
};

export type {
  ColumnType,
  DatetimeColumn,
  EnumColumn,
  FloatColumn,
  IntColumn,
  PermissionLevel,
  RawQueryColumn,
  StringColumn,
  TabularColumn,
  TabularColumnInfo,
  TabularColumnSummary
};

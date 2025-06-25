import { z } from 'zod';

import { $PermissionLevel } from './datasets';

const $ColumnType = z.enum(['STRING', 'INT', 'FLOAT', 'ENUM', 'DATETIME']);
type ColumnType = z.infer<typeof $ColumnType>;

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

const $RawQueryProps = z.object({
  __modelName: z.literal('TabularColumn'),
  _id: z.object({
    $oid: z.string()
  })
});
type RawQueryProps = z.infer<typeof $RawQueryProps>;

const $RawQueryColumn = $RawQueryProps.and($TabularColumn);
type RawQueryColumn = z.infer<typeof $RawQueryColumn>;

export {
  $ColumnType,
  $DatetimeColumn,
  $EnumColumn,
  $FloatColumn,
  $IntColumn,
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
  RawQueryColumn,
  RawQueryProps,
  StringColumn,
  TabularColumn,
  TabularColumnInfo,
  TabularColumnSummary
};

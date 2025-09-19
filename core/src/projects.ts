import { z } from 'zod/v4';

import { $ColumnType, $TabularColumnInfo, $TabularColumnSummary } from './columns';

//===================== Project Info ================================
const $ProjectInfo = z.object({
  createdAt: z.coerce.date(),
  description: z.string(),
  expiry: z.coerce.date(),
  externalId: z.string(),
  id: z.string(),
  name: z.string(),
  updatedAt: z.coerce.date(),
  userIds: z.string().array()
});
type $ProjectInfo = z.infer<typeof $ProjectInfo>;

//===================== Project Column Config ================================
const $ProjectDatasetConfigStep = z.enum(['selectColumns', 'configRows', 'configColumns']);
type $ProjectDatasetConfigStep = z.infer<typeof $ProjectDatasetConfigStep>;

//===================== Project Column Transformation ========================
const $ProjectColumnSummary = $TabularColumnSummary.and(
  z.object({
    id: z.string(),
    name: z.string()
  })
);
type $ProjectColumnSummary = z.infer<typeof $ProjectColumnSummary>;

//===================== Project Column Transformation ========================
const $ProjectDatasetRowConfig = z
  .object({
    rowMax: z.number().int().nullable(),
    rowMin: z.number().int().gte(0).default(0)
  })
  .refine((data) => data.rowMax === null || data.rowMax >= data.rowMin, {
    message: 'rowMax must be greater than or equal to rowMin'
  });
type $ProjectDatasetRowConfig = z.infer<typeof $ProjectDatasetRowConfig>;

const $ProjectDatasetColumnHash = z.object({
  length: z.number().int().default(10),
  salt: z.string().nullable()
});
type $ProjectDatasetColumnHash = z.infer<typeof $ProjectDatasetColumnHash>;

const $ProjectDatasetColumnTrim = z
  .object({
    end: z.number().int().nullable(),
    start: z.number().int().gte(0).default(0)
  })
  .refine((data) => data.end === null || data.end >= data.start, {
    message: 'end must be greater than or equal to start'
  });
type $ProjectDatasetColumnTrim = z.infer<typeof $ProjectDatasetColumnTrim>;

const $ProjectDatasetColumnConfig = z.object({
  hash: $ProjectDatasetColumnHash.nullable(),
  trim: $ProjectDatasetColumnTrim.nullable()
});
type $ProjectDatasetColumnConfig = z.infer<typeof $ProjectDatasetColumnConfig>;

//===================== Project Dataset ========================
const $ProjectDataset = z.object({
  columnConfigs: z.record(z.string(), $ProjectDatasetColumnConfig),
  columnIds: z.string().array(),
  datasetId: z.string(),
  rowConfig: $ProjectDatasetRowConfig
});

//===================== Create Project ========================
const $CreateProject = z.object({
  datasets: $ProjectDataset.array(),
  description: z.string().optional(),
  expiry: z.coerce.date(),
  externalId: z.string().optional(),
  name: z.string().min(1),
  userIds: z.string().array().min(1)
});

//===================== Update Project ========================
const $UpdateProject = z
  .object({
    datasets: z
      .object({
        columnConfigurations: $ProjectDatasetColumnConfig
          .and(
            z.object({
              columnId: z.string()
            })
          )
          .array(),
        columnIds: z.string().array(),
        datasetId: z.string(),
        rowFilter: z.object({
          rowMax: z.number().nullable(),
          rowMin: z.number()
        })
      })
      .array(),
    description: z.string().optional(),
    expiry: z.coerce.date(),
    externalId: z.string().optional(),
    name: z.string().min(1),
    userIds: z.string().array().min(1)
  })
  .partial();
//===================== Project Column ========================
const $ProjectColumnInfo = $TabularColumnInfo.omit({
  dataPermission: true,
  summaryPermission: true,
  tabularDataId: true
});
type $ProjectColumnInfo = z.infer<typeof $ProjectColumnInfo>;

//===================== Project Dataset Column View ========================
const $GetColumnViewDto = z.object({
  columnId: z.string(),
  hash: z
    .object({
      length: z.number().int().gte(0),
      salt: z.string().optional()
    })
    .optional(),
  rowMax: z.number().int().gte(0).optional(),
  rowMin: z.number().int().gte(0).optional(),
  trim: z
    .object({
      end: z.number().int().gte(0).optional(),
      start: z.number().int().gte(0)
    })
    .optional()
});
type $GetColumnViewDto = z.infer<typeof $GetColumnViewDto>;

//===================== Project Add Dataset Config =========================
const $ProjectDatasetSelectedColumn = z.object({
  description: z.string().optional(),
  kind: $ColumnType,
  name: z.string()
});
type $ProjectDatasetSelectedColumn = z.infer<typeof $ProjectDatasetSelectedColumn>;

const $ProjectAddDatasetConfig = z.object({
  columnsConfig: z.record(z.string(), $ProjectDatasetColumnConfig),
  currentColumnIdIndex: z.number().int().default(0),
  currentStep: $ProjectDatasetConfigStep,
  pageSize: z.number().int().default(10),
  rowConfig: $ProjectDatasetRowConfig,
  selectedColumns: z.record(z.string(), $ProjectDatasetSelectedColumn)
});
type $ProjectAddDatasetConfig = z.infer<typeof $ProjectAddDatasetConfig>;

type $ProjectDataset = z.infer<typeof $ProjectDataset>;
type $CreateProject = z.infer<typeof $CreateProject>;
type $UpdateProject = z.infer<typeof $UpdateProject>;

export {
  $CreateProject,
  $GetColumnViewDto,
  $ProjectAddDatasetConfig,
  $ProjectColumnInfo,
  $ProjectColumnSummary,
  $ProjectDataset,
  $ProjectDatasetColumnConfig,
  $ProjectDatasetColumnHash,
  $ProjectDatasetColumnTrim,
  $ProjectDatasetConfigStep,
  $ProjectDatasetRowConfig,
  $ProjectDatasetSelectedColumn,
  $ProjectInfo,
  $UpdateProject
};

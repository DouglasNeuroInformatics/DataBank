import { z } from 'zod';

import { $TabularColumnInfo, $TabularColumnSummary } from './columns';

//===================== Project Column Transformation ========================
const $ProjectColumnSummary = $TabularColumnSummary.and(
  z.object({
    id: z.string(),
    name: z.string()
  })
);
type ProjectColumnSummary = z.infer<typeof $ProjectColumnSummary>;

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

//===================== Project Dataset Column View ========================
const $GetColumnViewDto = $ProjectColumnTransformation.and($ProjectRowFilter);
type GetColumnViewDto = z.infer<typeof $GetColumnViewDto>;

export {
  $CreateProject,
  $GetColumnViewDto,
  $ProjectColumnHash,
  $ProjectColumnInfo,
  $ProjectColumnSummary,
  $ProjectColumnTransformation,
  $ProjectColumnTrim,
  $ProjectDataset,
  $ProjectRowFilter,
  $UpdateProject
};

export type {
  CreateProject,
  GetColumnViewDto,
  ProjectColumnHash,
  ProjectColumnSummary,
  ProjectColumnTransformation,
  ProjectColumnTrim,
  ProjectDataset,
  ProjectRowFilter,
  UpdateProject
};

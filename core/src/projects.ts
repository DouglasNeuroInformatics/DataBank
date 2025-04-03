import { z } from 'zod';

const $ProjectColumnHash = z.object({
  length: z.number().int().nullable(),
  salt: z.string()
});

const $ProjectColumnTrim = z.object({
  end: z.number().int().nullable(),
  start: z.number().int().nullable()
});

const $ProjectColumn = z.object({
  columnId: z.string(),
  hash: $ProjectColumnHash.nullable(),
  trim: $ProjectColumnTrim.nullable()
});

type ProjectColumn = z.infer<typeof $ProjectColumn>;

const $ProjectRowFilter = z.object({
  rowMax: z.number().int().nullable(),
  rowMin: z.number().int().gte(0).default(0).nullable()
});

const $ProjectDataset = z.object({
  columns: $ProjectColumn.array(),
  datasetId: z.string(),
  dataTypeFilters: z.enum(['INT', 'FLOAT', 'STRING', 'ENUM', 'DATETIME', 'BOOLEAN']).array(),
  rowFilter: $ProjectRowFilter.nullable(),
  useDataTypeFilter: z.boolean(),
  useRowFilter: z.boolean()
});

type ProjectDataset = z.infer<typeof $ProjectDataset>;

const $CreateProject = z.object({
  datasets: $ProjectDataset.array(),
  description: z.string().optional(),
  expiry: z.coerce.date(),
  externalId: z.string().optional(),
  name: z.string().min(1),
  userIds: z.string().array().min(1)
});

type CreateProject = z.infer<typeof $CreateProject>;

const $UpdateProject = $CreateProject.partial();
type UpdateProject = z.infer<typeof $UpdateProject>;

const $GetColumnViewDto = $ProjectColumn.merge($ProjectRowFilter);
type GetColumnViewDto = z.infer<typeof $GetColumnViewDto>;

export { $CreateProject, $GetColumnViewDto, $ProjectDataset, $UpdateProject };
export type { CreateProject, GetColumnViewDto, ProjectColumn, ProjectDataset, UpdateProject };

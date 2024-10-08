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

export type ProjectDatasetDto = z.infer<typeof $ProjectDataset>;

export type ProjectDataset = z.infer<typeof $ProjectDataset>;

const $CreateProjectDto = z.object({
  datasets: $ProjectDataset.array(),
  description: z.string().nullable(),
  expiry: z.date(),
  externalId: z.string().nullable(),
  name: z.string().min(1),
  userIds: z.string().array().min(1)
});

export type CreateProjectDto = z.infer<typeof $CreateProjectDto>;

export const $UpdateProjectDto = $CreateProjectDto.partial();
export type UpdateProjectDto = z.infer<typeof $UpdateProjectDto>;

export const $GetColumnViewDto = $ProjectColumn.merge($ProjectRowFilter);
export type GetColumnViewDto = z.infer<typeof $GetColumnViewDto>;

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
  rowMax: z.number().int().nullable(),
  rowMin: z.number().int().nullable(),
  trim: $ProjectColumnTrim.nullable()
});

const $ProjectDataset = z.object({
  columns: $ProjectColumn.array(),
  // datatypeFilters DatatypeFilters[]
  datasetId: z.string(),
  useColumnFilter: z.boolean()
});

export type ProjectDatasetDto = z.infer<typeof $ProjectDataset>;

export type ProjectDataset = z.infer<typeof $ProjectDataset>;

const $CreateProjectDto = z.object({
  datasets: $ProjectDataset.array(),
  description: z.string().nullable(),
  expiry: z.date(),
  externalId: z.string().nullable(),
  name: z.string(),
  userIds: z.string().array().min(1)
});

export type CreateProjectDto = z.infer<typeof $CreateProjectDto>;

const $UpdateProjectDto = $CreateProjectDto.partial();
export type UpdateProjectDto = z.infer<typeof $UpdateProjectDto>;

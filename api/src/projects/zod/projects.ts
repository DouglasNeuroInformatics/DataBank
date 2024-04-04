import { z } from 'zod';

const $ProjectColumnHash = z.object({
  length: z.number().int().optional(),
  salt: z.string()
});

const $ProjectColumnTrim = z.object({
  end: z.number().int().optional(),
  start: z.number().int().optional()
});

const $ProjectColumn = z.object({
  columnId: z.string(),
  hash: $ProjectColumnHash.optional(),
  rowMax: z.number().int().optional(),
  rowMin: z.number().int().optional(),
  trim: $ProjectColumnTrim.optional()
});

const $ProjectDataset = z.object({
  columns: $ProjectColumn.array(),
  // datatypeFilters DatatypeFilters[]
  datasetId: z.string(),
  useColumnFilter: z.boolean()
});

export type ProjectDataset = z.infer<typeof $ProjectDataset>;

const $CreateProjectDto = z.object({
  datasets: $ProjectDataset.array(),
  description: z.string().optional(),
  expiry: z.date(),
  externalId: z.string().optional(),
  name: z.string(),
  userIds: z.string().array().min(1)
});

export type CreateProjectDto = z.infer<typeof $CreateProjectDto>;

const $UpdateProjectDto = $CreateProjectDto.partial();
export type UpdateProjectDto = z.infer<typeof $UpdateProjectDto>;

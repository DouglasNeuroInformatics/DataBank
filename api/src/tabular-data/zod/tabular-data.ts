import { z } from 'zod';

const $GetTabularDataViewDto = z.object({
  columnIds: z.string().array(),
  tabularDataId: z.string()
});

export type GetTabularDataViewDto = z.infer<typeof $GetTabularDataViewDto>;

const $CreateTabularColumnDto = z.object({
  datasetId: z.string()
});

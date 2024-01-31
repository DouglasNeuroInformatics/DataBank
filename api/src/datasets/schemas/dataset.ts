import { DatasetLicense, DatasetType } from '@prisma/client';
import { z } from 'zod'



const $TabularData = z.object({
    data: z.record(z.string(), z.string().or(z.number()).or(z.boolean()))
})

export type TabularData = z.infer<typeof $TabularData>;

const $Dataset = z.object({
    // managerIds  String[]        @db.ObjectId
    datasetType: z.nativeEnum(DatasetType),
    description: z.string().optional(),
    id: z.string(),
    license: z.nativeEnum(DatasetLicense),
    name: z.string(),
    // managers    User[]          @relation(fields: [managerIds], references: [id])
    tabularData: z.optional($TabularData),
    updatedAt: z.string().datetime()
})

export type TabularDataset = z.infer<typeof $Dataset>;

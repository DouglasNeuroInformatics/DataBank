import { z } from 'zod'



const $TabularData = z.object({
    data: z.record(z.string(), z.string().or(z.number()).or(z.boolean()))
})

export type TabularData = z.infer<typeof $TabularData>;

const $Dataset = z.object({
    createdAt: z.string().datetime(),
    // managerIds  String[]        @db.ObjectId
    datasetType: z.enum(["TABULAR"]),
    description: z.string().optional(),
    id: z.string(),
    license: z.enum(['PUBLIC', 'OTHER']),
    name: z.string(),
    // managers    User[]          @relation(fields: [managerIds], references: [id])
    tabularData: z.any().optional(),
    updatedAt: z.string().datetime()
})

export type TabularDataset = z.infer<typeof $Dataset>;

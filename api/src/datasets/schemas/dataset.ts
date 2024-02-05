import { ColumnType, DatasetLicense, DatasetType, PermissionLevel, type ColumnSummary } from '@prisma/client';
import { z } from 'zod'



const $TabularColumn = z.object({
    // validation: z.union([]),
    dataPermission: z.nativeEnum(PermissionLevel),
    metaDataPermission: z.nativeEnum(PermissionLevel),
    name: z.string(),
    nullable: z.boolean(),
    summary: z.object({
        count: z.number().int()
    }),
    type: z.nativeEnum(ColumnType)
}) as z.ZodType<TableColumn<TableEntry>>;


type TableColumn<T extends TableEntry> = {
    name: Extract<keyof T, string>
}

z.object({
    name: z.string(),
    nullable: z.boolean(),
}) as z.ZodType<TableColumn

const $TableEntry = z.record(z.string(), z.string().or(z.number()).or(z.boolean()));
type TableEntry = z.infer<typeof $TableEntry>;

const $TabularData = z.object({
    columns: z.array($TabularColumn),
    data: z.record(z.string(), z.string().or(z.number()).or(z.boolean())),
    primaryKeys: z.array(z.string()).nonempty()
})

export type TabularData = z.infer<typeof $TabularData>;

const $Dataset = z.object({
    datasetType: z.nativeEnum(DatasetType),
    description: z.string().optional(),
    id: z.string(),
    license: z.nativeEnum(DatasetLicense),
    managerIds: z.array(z.string()).min(1),
    name: z.string(),
    updatedAt: z.string().datetime()
})

const $TabularDataset = $Dataset.and(z.object({
    tabularData: $TabularData,
}))

export type TabularDataset = z.infer<typeof $TabularDataset>;

let myTabularDS: TabularDataset = {
    datasetType: 'TABULAR',
    description: 'hahahaha',
    id: 'wowowo',
    license: 'PUBLIC',
    managerIds: ['wowowo'],
    name: 'test',
    tabularData: {
        columns: [
            {
                dataPermission: 'VERIFIED',
                metaDataPermission: 'VERIFIED',
                name: 'height',
                nullable: false,
                type: 'FLOAT_COLUMN'
            }
        ],
        data: { name: 'hello' },
        primaryKeys: ['height']
    },
    updatedAt: '2023-09-06'
}

console.log(myTabularDS)

const $CreateDataSetDto = z.object({
    datasetType: z.nativeEnum(DatasetType),
    description: z.optional(z.string()),
    licence: z.nativeEnum(DatasetLicense),
    managerId: z.string(),
    name: z.string(),
    tabularData: z.optional($TabularData)
});

export type CreateDatasetDto = z.infer<typeof $CreateDataSetDto>;

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import type { DatasetColumn, DatasetData, TDataset } from '@databank/types';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { User } from '@/users/schemas/user.schema.js';

@Schema({
  timestamps: {
    currentTime: () => Date.now(),
    createdAt: true,
    updatedAt: true
  },
  strict: 'throw'
})
export class Dataset<
  TColumns extends Record<string, DatasetColumn> = Record<string, DatasetColumn>,
  TData extends DatasetData<TColumns> = DatasetData<TColumns>
> implements Omit<TDataset<TColumns>, '_id' | 'createdAt' | 'updatedAt'>
{
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  owner: User;

  @Prop({ required: true })
  license: string;

  @Prop({ required: true, type: Object })
  columns: TColumns;

  @Prop({ required: true, type: Object })
  data: TData;
}

export type DatasetDocument = HydratedDocument<Dataset>;

export const DatasetSchema = SchemaFactory.createForClass(Dataset);

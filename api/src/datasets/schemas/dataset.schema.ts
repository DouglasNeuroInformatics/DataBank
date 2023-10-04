import type { DatasetEntry, DatasetLicense, TDataset } from '@databank/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { User } from '@/users/schemas/user.schema';

import { DatasetColumn, DatasetColumnSchema } from './dataset-column.schema';

@Schema({
  strict: 'throw',
  timestamps: {
    createdAt: true,
    currentTime: () => Date.now(),
    updatedAt: true
  }
})
export class Dataset<T extends DatasetEntry = DatasetEntry>
  implements Omit<TDataset<T>, '_id' | 'createdAt' | 'updatedAt'>
{
  @Prop({ required: true, type: [DatasetColumnSchema] })
  columns: DatasetColumn<T>[];

  @Prop({ required: true, type: [Object] })
  data: T[];

  @Prop({ required: true })
  description: string;

  @Prop({ enum: ['PUBLIC_DOMAIN', 'OTHER'] satisfies DatasetLicense[], required: true, type: String })
  license: DatasetLicense;

  @Prop({ required: true })
  name: string;

  @Prop({ ref: User.name, required: true, type: MongooseSchema.Types.ObjectId })
  owner: User;
}

export type DatasetDocument = HydratedDocument<Dataset>;

export const DatasetSchema = SchemaFactory.createForClass(Dataset);

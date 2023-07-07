import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import type { DatasetLicense } from '@databank/types';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { DatasetColumn, DatasetColumnSchema } from './dataset-column.schema.js';

import { User } from '@/users/schemas/user.schema.js';

@Schema({
  timestamps: {
    currentTime: () => Date.now(),
    createdAt: true,
    updatedAt: true
  },
  strict: 'throw'
})
export class Dataset {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: User.name })
  owner: User;

  @Prop({ required: true, enum: ['PUBLIC_DOMAIN', 'OTHER'] satisfies DatasetLicense[], type: String })
  license: DatasetLicense;

  @Prop({ required: true, type: [DatasetColumnSchema] })
  columns: DatasetColumn[];
}

export type DatasetDocument = HydratedDocument<Dataset>;

export const DatasetSchema = SchemaFactory.createForClass(Dataset);

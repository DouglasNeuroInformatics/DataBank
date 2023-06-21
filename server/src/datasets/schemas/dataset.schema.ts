import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

@Schema()
export class Dataset {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description: string;
}

export type DatasetDocument = HydratedDocument<Dataset>;

export const DatasetSchema = SchemaFactory.createForClass(Dataset);

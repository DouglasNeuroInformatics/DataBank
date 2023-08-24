import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import type { DatasetColumnType } from '@databank/types';

@Schema()
export class DatasetColumn {
  @Prop({ required: true, unique: true })
  name: string;
  
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  nullable: boolean;

  @Prop({ required: true, type: String, enum: ['FLOAT', 'INTEGER', 'STRING'] satisfies DatasetColumnType[] })
  type: DatasetColumnType;
}

export const DatasetColumnSchema = SchemaFactory.createForClass(DatasetColumn);

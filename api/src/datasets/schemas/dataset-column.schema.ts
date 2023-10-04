import type { DatasetColumnType, DatasetEntry, TDatasetColumn } from '@databank/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class DatasetColumn<T extends DatasetEntry = DatasetEntry> implements TDatasetColumn<T> {
  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: String })
  name: Extract<keyof T, string>;

  @Prop({ required: true })
  nullable: boolean;

  @Prop({ required: true, type: String })
  type: DatasetColumnType;
}

export const DatasetColumnSchema = SchemaFactory.createForClass(DatasetColumn);

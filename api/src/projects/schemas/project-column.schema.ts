import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import type { ProjectColumnType, ProjectEntry, TProjectColumn } from '@databank/types';

@Schema()
export class ProjectColumn<T extends ProjectEntry = ProjectEntry> implements TProjectColumn<T> {
  // Prop is a decorator that defines a property on a class
  // the type inside of Prop is the type of the property
  @Prop({ required: true, type: String })
  // We use Extract here to ensure that the name is a key of the type T
  // keyof T would allow any string, but we want to ensure that the name is a key of T
  name: Extract<keyof T, string>;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  nullable: boolean;

  @Prop({ required: true, type: String })
  type: ProjectColumnType;
}

export const ProjectColumnSchema = SchemaFactory.createForClass(ProjectColumn);

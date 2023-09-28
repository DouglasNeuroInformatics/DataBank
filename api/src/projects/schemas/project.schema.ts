import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ProjectEntry } from '@databank/types';
import * as mongoose from 'mongoose';

import { ProjectColumn, ProjectColumnSchema } from './project-column.schema.js';

import { User } from '@/users/schemas/user.schema.js';

export type ProjectDocument = mongoose.HydratedDocument<Project>;

@Schema({
  timestamps: {
    currentTime: () => Date.now(),
    createdAt: true,
    updatedAt: true
  },
  strict: 'throw'
})
export class Project<T extends ProjectEntry = ProjectEntry> {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  externalId: string;

  // allows for multiple users
  @Prop({ required: false, type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }] })
  users: User[];

  // Allows for multiple owners
  @Prop({ required: true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }] })
  owners: User[];

  @Prop({ required: true })
  expiry: Date;

  @Prop({ required: true, type: [ProjectColumnSchema] })
  columns: ProjectColumn<T>[];

  @Prop({ required: true, type: [Object] })
  data: T[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

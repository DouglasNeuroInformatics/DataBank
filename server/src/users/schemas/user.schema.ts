import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { type UserRole } from '@app/types';
import { HydratedDocument } from 'mongoose';

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  hashedPassword: string;

  @Prop({ required: true, type: String })
  role: UserRole;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);

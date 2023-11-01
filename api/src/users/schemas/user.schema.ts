import type { TUser, UserRole } from '@databank/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument } from 'mongoose';

import { ConfirmEmailCode, ConfirmEmailCodeSchema } from '@/auth/schemas/confirm-email-code.schema';

@Schema({
  toObject: {
    transform: (doc, ret) => {
      ret.id = doc.id as string;
      return ret;
    }
  }
})
export class User implements TUser {
  @Prop({ required: false, type: ConfirmEmailCodeSchema })
  confirmEmailCode?: ConfirmEmailCode;

  /** The timestamp when the user confirmed their email */
  @Prop()
  confirmedAt: null | number | undefined;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true, select: false })
  hashedPassword: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, type: String })
  role: UserRole;

  /** The timestamp when the user verified their account */
  @Prop()
  verifiedAt: null | number | undefined;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);

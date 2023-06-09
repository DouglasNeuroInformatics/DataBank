import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { TUser, type UserRole } from '@databank/types';
import { HydratedDocument } from 'mongoose';

import { VerificationCode, VerificationCodeSchema } from '@/auth/schemas/verification-code.schema.js';

@Schema({
  toObject: {
    transform: (doc, ret) => {
      ret.id = doc.id as string;
      return ret;
    }
  }
})
export class User implements TUser {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  hashedPassword: string;

  @Prop({ required: true, type: String })
  role: UserRole;

  @Prop({ required: true })
  isVerified: boolean;

  /** The timestamp when the user verified their email */
  @Prop({ required: false })
  verifiedAt?: number;

  @Prop({ required: false, type: VerificationCodeSchema })
  verificationCode?: VerificationCode;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);

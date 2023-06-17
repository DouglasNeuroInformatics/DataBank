import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { type UserRole } from '@databank/types';
import { HydratedDocument } from 'mongoose';

import { VerificationCode, VerificationCodeSchema } from '@/auth/schemas/verification-code.schema.js';

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  hashedPassword: string;

  @Prop({ required: true, type: String })
  role: UserRole;

  @Prop({ required: true })
  isVerified: boolean;

  /** The timestamp when the user verified their email */
  @Prop({ required: false })
  verifiedAt: number;

  @Prop({ required: false, type: VerificationCodeSchema })
  verificationCode: VerificationCode;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);

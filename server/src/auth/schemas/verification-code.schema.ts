import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class VerificationCode {
  @Prop({ required: true })
  expiry: number;

  @Prop({ required: true })
  value: number;
}

export const VerificationCodeSchema = SchemaFactory.createForClass(VerificationCode);

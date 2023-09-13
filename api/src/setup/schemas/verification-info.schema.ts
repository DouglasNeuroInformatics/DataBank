import { TVerificationInfo } from "@databank/types";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ discriminatorKey: 'kind' })
export class VerificationInfo{
  @Prop({
    type: String,
    required: true,
    enum: ["VERIFICATION_UPON_CONFIRM_EMAIL", "VERIFICATION_WITH_REGEX", "MANUAL_VERIFICATION"] satisfies TVerificationInfo["kind"][],
  })
  kind: TVerificationInfo["kind"];
}

export const VerificationInfoSchema = SchemaFactory.createForClass(VerificationInfo);
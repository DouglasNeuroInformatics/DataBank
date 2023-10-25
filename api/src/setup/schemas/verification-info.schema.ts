import type { TVerificationInfo } from "@databank/types";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ discriminatorKey: 'kind' })
export class VerificationInfo{
  @Prop({
    enum: ["VERIFICATION_UPON_CONFIRM_EMAIL", "VERIFICATION_WITH_REGEX", "MANUAL_VERIFICATION"] satisfies TVerificationInfo["kind"][],
    required: true,
    type: String,
  })
  kind: TVerificationInfo["kind"];
}

export const VerificationInfoSchema = SchemaFactory.createForClass(VerificationInfo);
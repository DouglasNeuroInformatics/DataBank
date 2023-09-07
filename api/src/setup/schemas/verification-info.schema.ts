import { TVerificationInfo } from "@databank/types";
import { VerificationUponConfirmEmail } from "./verification-upon-confirm-email.schema.js";
import { VerificationWithRegex } from "./verification-with-regex.schema.js";
import { ManualVerification } from "./manual-verification.schema.js";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ discriminatorKey: 'kind' })
export class VerificationInfo implements TVerificationInfo {
  @Prop({
    type: String,
    required: true,
    enum: ["VERIFICATION_UPON_CONFIRM_EMAIL", "VERIFICATION_WITH_REGEX", "MANUAL_VERIFICATION"] satisfies [VerificationUponConfirmEmail["kind"], VerificationWithRegex["kind"], ManualVerification["kind"]],
  })
  kind: string;
}

export const VerificationInfoSchema = SchemaFactory.createForClass(VerificationInfo);
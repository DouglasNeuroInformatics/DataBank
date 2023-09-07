import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { TVerificationUponConfirmEmail } from '@databank/types';

@Schema()
export class VerificationUponConfirmEmail implements TVerificationUponConfirmEmail {
  /** The kind of verification method: auto verification when user confirms their email */
  @Prop({ required: true })
  kind: "VERIFICATION_UPON_CONFIRM_EMAIL";
}

export const VerificationUponConfirmEmailSchema = SchemaFactory.createForClass(VerificationUponConfirmEmail);
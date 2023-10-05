import type { TVerificationUponConfirmEmail } from '@databank/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class VerificationUponConfirmEmail implements TVerificationUponConfirmEmail {
  /** The kind of verification method: auto verification when user confirms their email */
  @Prop({ required: true })
  kind: TVerificationUponConfirmEmail['kind'];
}

export const VerificationUponConfirmEmailSchema = SchemaFactory.createForClass(VerificationUponConfirmEmail);
import type { TVerificationWithRegex } from '@databank/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class VerificationWithRegex implements TVerificationWithRegex {
  /** The kind of verification method: verify with regex */
  @Prop({ required: true })
  kind: TVerificationWithRegex['kind'];

  /** The regex used to match with the user's email pattern */
  @Prop({ required: true })
  regex: string;
}

export const VerificationWithRegexSchema = SchemaFactory.createForClass(VerificationWithRegex);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { TManualVerification } from '@databank/types';

@Schema()
export class ManualVerification implements TManualVerification {
  /** The kind of verification method: manual verification by admin */
  @Prop({ required: true })
  kind: "MANUAL_VERIFICATION";
}

export const ManualVerificationSchema = SchemaFactory.createForClass(ManualVerification);
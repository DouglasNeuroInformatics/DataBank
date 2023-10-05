import type { TManualVerification } from '@databank/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class ManualVerification implements TManualVerification {
  /** The kind of verification method: manual verification by admin */
  @Prop({ required: true })
  kind: TManualVerification['kind'];
}

export const ManualVerificationSchema = SchemaFactory.createForClass(ManualVerification);
import type { TSetupConfig, TVerificationInfo} from "@databank/types";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class SetupConfig implements TSetupConfig{
  /** verification info stored in setup config, more setup config objects can be added later if needed */
  @Prop({
    type: Object,
    required: true
  })
  verificationInfo: TVerificationInfo;
}

export const SetupConfigSchema = SchemaFactory.createForClass(SetupConfig);
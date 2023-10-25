import type { TSetupConfig, TVerificationInfo} from "@databank/types";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class SetupConfig implements TSetupConfig{
  /** verification info stored in setup config, more setup config objects can be added later if needed */
  @Prop({
    required: true,
    type: Object
  })
  verificationInfo: TVerificationInfo;
}

export const SetupConfigSchema = SchemaFactory.createForClass(SetupConfig);
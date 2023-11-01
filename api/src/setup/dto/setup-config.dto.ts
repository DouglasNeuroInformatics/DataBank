import type { TSetupConfig, TVerificationInfo } from '@databank/types';

import { ValidateDto } from '@/core/decorators/validate-dto.decorator';

import { VerificationInfo } from '../schemas/verification-info.schema';

export class SetupConfigDto implements TSetupConfig {
  @ValidateDto(VerificationInfo)
  verificationInfo: TVerificationInfo;
}

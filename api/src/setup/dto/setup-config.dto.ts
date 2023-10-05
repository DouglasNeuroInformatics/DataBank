import type { TSetupConfig, TVerificationInfo } from '@databank/types';

export class SetupConfigDto implements TSetupConfig {
  verificationInfo: TVerificationInfo;
}
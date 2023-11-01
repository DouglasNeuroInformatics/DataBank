import type { SetupOptions, TSetupConfig } from '@databank/types';
import { OmitType } from '@nestjs/swagger';

import { ValidateDto } from '@/core/decorators/validate-dto.decorator.js';
import { CreateUserDto } from '@/users/dto/create-user.dto.js';

import { SetupConfigDto } from './setup-config.dto.js';

export class CreateAdminDto extends OmitType(CreateUserDto, ['role', 'verifiedAt', 'confirmedAt'] as const) {}

export class SetupDto implements SetupOptions {
  @ValidateDto(CreateAdminDto)
  admin: CreateAdminDto;

  @ValidateDto(SetupConfigDto)
  setupConfig: TSetupConfig;
}

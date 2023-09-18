import { OmitType } from '@nestjs/swagger';

import type { TSetupConfig, SetupOptions } from '@databank/types';

import { CreateUserDto } from '@/users/dto/create-user.dto.js';
import { ValidateDto } from '@/core/decorators/validate-dto.decorator.js';
import { SetupConfigDto } from './setup-config.dto.js';

export class CreateAdminDto extends OmitType(CreateUserDto, ['role', 'verifiedAt'] as const) {}

export class SetupDto implements SetupOptions {
  @ValidateDto(CreateAdminDto)
  admin: CreateAdminDto;

  @ValidateDto(SetupConfigDto)
  setupConfig: TSetupConfig;
}

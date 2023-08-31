import { OmitType } from '@nestjs/swagger';

import { SetupOptions } from '@databank/types';
import { Type } from 'class-transformer';
import { IsNotEmptyObject, ValidateNested } from 'class-validator';

import { CreateUserDto } from '@/users/dto/create-user.dto.js';

export class CreateAdminDto extends OmitType(CreateUserDto, ['role', 'isVerified'] as const) {}

export class SetupDto implements SetupOptions {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateAdminDto)
  admin: CreateAdminDto;
}

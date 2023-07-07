import type { DatasetLicense } from '@databank/types';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsIn, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { DatasetColumnDto } from './dataset-column.dto.js';

export class CreateDatasetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsIn(['PUBLIC_DOMAIN', 'OTHER'] satisfies DatasetLicense[])
  license: DatasetLicense;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DatasetColumnDto)
  columns: DatasetColumnDto[];
}

import { PartialType } from '@nestjs/swagger';

import type { DatasetColumnType } from '@databank/types';
import { IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DatasetColumnDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  nullable: boolean;

  @IsString()
  @IsIn(['FLOAT', 'INTEGER', 'STRING'] satisfies DatasetColumnType[])
  type: DatasetColumnType;
}

export class UpdateDatasetColumnDto extends PartialType(DatasetColumnDto) {
  @IsOptional()
  description?: string | undefined;

  @IsOptional()
  nullable?: boolean | undefined;

  @IsOptional()
  type?: DatasetColumnType | undefined;
}

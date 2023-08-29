import { PartialType } from '@nestjs/swagger';

import type { DatasetColumnType, DatasetEntry, TDatasetColumn } from '@databank/types';
import { IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DatasetColumnDto<T extends DatasetEntry> implements TDatasetColumn<T> {
  @IsString()
  @IsNotEmpty()
  name: Extract<keyof T, string>;

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
  name?: string | undefined;

  @IsOptional()
  description?: string | undefined;

  @IsOptional()
  nullable?: boolean | undefined;

  @IsOptional()
  type?: DatasetColumnType | undefined;
}

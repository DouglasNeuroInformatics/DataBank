import type { DatasetColumnType, DatasetEntry, DatasetLicense, TDataset, TDatasetColumn } from '@databank/types';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsBoolean, IsIn, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

class DatasetColumnDto<T extends DatasetEntry> implements TDatasetColumn<T> {
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

export class CreateDatasetDto<T extends DatasetEntry = DatasetEntry>
  implements Omit<TDataset<T>, '_id' | 'createdAt' | 'updatedAt' | 'owner'>
{
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
  @Type(() => DatasetColumnDto<T>)
  columns: DatasetColumnDto<T>[];

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Object)
  data: T[];
}

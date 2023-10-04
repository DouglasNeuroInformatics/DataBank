import type { DatasetEntry, DatasetLicense, TDataset } from '@databank/types';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsIn, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { DatasetColumnDto } from './dataset-column.dto';

export class CreateDatasetDto<T extends DatasetEntry = DatasetEntry>
  implements Omit<TDataset<T>, '_id' | 'createdAt' | 'owner' | 'updatedAt'>
{
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

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsIn(['PUBLIC_DOMAIN', 'OTHER'] satisfies DatasetLicense[])
  license: DatasetLicense;

  @IsString()
  @IsNotEmpty()
  name: string;
}

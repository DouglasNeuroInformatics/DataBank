import type { DatasetColumn, DatasetData, TDataset } from '@databank/types';
import { IsNotEmpty, IsNotEmptyObject, IsString } from 'class-validator';

export class CreateDatasetDto<
  TColumns extends Record<string, DatasetColumn> = Record<string, DatasetColumn>,
  TData extends DatasetData<TColumns> = DatasetData<TColumns>
> implements Omit<TDataset<TColumns>, '_id' | 'createdAt' | 'updatedAt' | 'owner'>
{
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  license: string;

  @IsNotEmptyObject()
  columns: TColumns;

  @IsNotEmptyObject()
  data: TData;
}

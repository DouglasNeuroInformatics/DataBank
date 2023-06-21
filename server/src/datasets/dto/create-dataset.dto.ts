import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDatasetDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @IsNotEmpty()
  license: string;
}

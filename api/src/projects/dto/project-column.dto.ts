import { PartialType } from '@nestjs/swagger';

import type { ProjectColumnType, ProjectEntry, TProjectColumn } from '@databank/types';
import { IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ProjectColumnDto<T extends ProjectEntry> implements TProjectColumn<T> {
  @IsString()
  @IsNotEmpty()
  name: Extract<keyof T, string>;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  nullable: boolean;

  @IsString()
  @IsIn(['FLOAT', 'INTEGER', 'STRING'] satisfies ProjectColumnType[])
  type: ProjectColumnType;
}

export class UpdateProjectColumnDto extends PartialType(ProjectColumnDto) {
  @IsOptional()
  name?: string | undefined;

  @IsOptional()
  description: string | undefined;

  @IsOptional()
  nullable: boolean | undefined;

  @IsOptional()
  type: ProjectColumnType;
}

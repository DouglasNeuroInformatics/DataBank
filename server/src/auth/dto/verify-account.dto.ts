import { IsNumber } from 'class-validator';

export class VerifyAccountDto {
  @IsNumber()
  code: number;
}

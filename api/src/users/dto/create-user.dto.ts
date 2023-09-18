import { type UserRole } from '@databank/types';
import { IsBoolean, IsEmail, IsIn, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  firstName: string;

  @IsBoolean()
  isVerified: boolean;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  password: string;

  @IsIn(['admin'] satisfies UserRole[])
  role: UserRole;

  @IsBoolean()
  isVerified?: boolean;

  @IsNumber()
  verifiedAt?: number;

  @IsNumber()
  confirmedAt?: number;
}

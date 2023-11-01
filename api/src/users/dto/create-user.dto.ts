import { type UserRole } from '@databank/types';
import { IsEmail, IsIn, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  confirmedAt: null | number;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  password: string;

  @IsIn(['admin'] satisfies UserRole[])
  role: UserRole;

  @IsNumber()
  verifiedAt: null | number;
}

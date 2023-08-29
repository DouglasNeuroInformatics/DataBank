import { type UserRole } from '@databank/types';
import { IsBoolean, IsEmail, IsIn, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsIn(['admin'] satisfies UserRole[])
  role: UserRole;

  @IsBoolean()
  isVerified: boolean;
}

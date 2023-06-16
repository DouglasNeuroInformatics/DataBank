import { type UserRole } from '@app/types';
import { IsEmail, IsIn, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsIn(['admin'] satisfies UserRole[])
  role: UserRole;
}

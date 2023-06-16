import { LoginCredentials } from '@app/types';
import { IsNotEmpty } from 'class-validator';

export class LoginRequestDto implements LoginCredentials {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

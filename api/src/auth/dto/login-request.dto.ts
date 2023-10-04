import type { LoginCredentials } from '@databank/types';
import { IsNotEmpty } from 'class-validator';

export class LoginRequestDto implements LoginCredentials {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

import type { LoginCredentials } from '@databank/types';
import { ValidationSchema } from '@douglasneuroinformatics/libnest/core';
import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

@ValidationSchema(
  z.object({
    email: z.string().min(1),
    password: z.string().min(1)
  })
)
export class LoginRequestDto implements LoginCredentials {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

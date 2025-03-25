import type { LoginCredentials } from '@databank/core';
import { ValidationSchema } from '@douglasneuroinformatics/libnest';
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

import { ValidationSchema } from '@douglasneuroinformatics/libnest/core';
import { z } from 'zod';

@ValidationSchema(
  z.object({
    code: z.number()
  })
)
export class VerifyAccountDto {
  code: number;
}

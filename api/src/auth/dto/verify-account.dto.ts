import { ValidationSchema } from '@douglasneuroinformatics/libnest';
import { z } from 'zod';

@ValidationSchema(
  z.object({
    code: z.number()
  })
)
export class VerifyAccountDto {
  code: number;
}

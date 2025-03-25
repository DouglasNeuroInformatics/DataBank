import { ValidationSchema } from '@douglasneuroinformatics/libnest';
import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

@ValidationSchema(
  z.object({
    email: z.string().min(1),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    password: z.string().min(1)
  })
)
export class CreateAccountDto {
  datasetId: string[];

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  password: string;
}

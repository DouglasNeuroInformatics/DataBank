import { UserRole } from '@prisma/client';
import { z } from 'zod';

const $UserRole: Zod.ZodType<UserRole> = z.enum(['ADMIN', 'STANDARD']);

export const $CreateUserDto = z.object({
  confirmedAt: z.coerce.date().optional(),

  email: z.string().email(),

  firstName: z.string().min(1),

  lastName: z.string().min(1),

  password: z.string(), // TO_DO: let user configure how strong the password should be

  role: z.optional($UserRole),

  verifiedAt: z.coerce.date().nullable().optional()
});

export type CreateUserDto = z.infer<typeof $CreateUserDto>;

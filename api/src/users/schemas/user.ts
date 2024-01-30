import { UserRole } from '@prisma/client';
import { z } from 'zod'

export const $CreateUserDto = z.object({

    email: z.string().email(),

    firstName: z.string().min(1),

    lastName: z.string().min(1),

    password: z.string(),  // TO_DO: let user configure how strong the password should be

    role: z.optional(z.nativeEnum(UserRole))
});

export type CreateUserDto = z.infer<typeof $CreateUserDto>;
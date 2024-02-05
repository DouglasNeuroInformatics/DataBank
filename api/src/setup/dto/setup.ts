import { UserRole, VerificationMethod } from '@prisma/client'
import { z } from 'zod'

const $CreateAdminDto = z.object({
    email: z.string(),

    firstName: z.string(),

    lastName: z.string(),

    password: z.string(),

    role: z.nativeEnum(UserRole),
})

export type CreateAdminDto = z.infer<typeof $CreateAdminDto>;

const $SetupConfig = z.object({
    emailRegex: z.optional(z.string()),
    method: z.nativeEnum(VerificationMethod)
})

const $Setup = z.object({
    admin: $CreateAdminDto,
    setupConfig: $SetupConfig
})

export type SetupDto = z.infer<typeof $Setup>;
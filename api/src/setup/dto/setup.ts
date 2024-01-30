import { VerificationMethod } from '@prisma/client'
import { z } from 'zod'

const $Setup = z.object({
    userVerification: z.object({
        emailRegex: z.optional(z.string()),
        method: z.nativeEnum(VerificationMethod)
    })
})

export type SetupDto = z.infer<typeof $Setup>;
import { z } from 'zod'

const $CreateAdminDto = z.object({
    email: z.string(),

    firstName: z.string(),

    lastName: z.string(),

    password: z.string(),

    role: z.literal("ADMIN"),
})

export type CreateAdminDto = z.infer<typeof $CreateAdminDto>;


export const $ManualVerification = z.object({
    method: z.literal('MANUAL')
})

export const $RegexEmailVerification = z.object({
    method: z.literal('REGEX_EMAIL'),
    regex: z.string()
})

export const $ConfirmEmailVerification = z.object({
    method: z.literal('CONFIRM_EMAIL')
})

export const $UserVerification = z.discriminatedUnion('method', [$ManualVerification, $RegexEmailVerification, $ConfirmEmailVerification,]);
export type UserVerification = z.infer<typeof $UserVerification>;

export const $SetupConfig = z.object({
    userVerification: $UserVerification,
})
export type SetupConfig = z.infer<typeof $SetupConfig>;


export const $SetupDto = z.object({
    admin: $CreateAdminDto,
    setupConfig: $SetupConfig
})
export type SetupDto = z.infer<typeof $SetupDto>;
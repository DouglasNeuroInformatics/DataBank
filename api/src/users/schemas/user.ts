import { z } from 'zod'

export const $UserData = z.object({
    // /** The timestamp when the user confirmed their email */
    confirmedAt: z.string().datetime(),

    createdAt: z.string().datetime(),

    email: z.string().email(),

    firstName: z.string().min(1),

    id: z.string(),

    lastName: z.string().min(1),

    password: z.string(),  // TO_DO: let user configure how strong the password should be

    // confirmEmailCode? ConfirmEmailCode;

    role: z.enum(['ADMIN', 'STANDARD']),

    verifiedAt: z.string().datetime(),
});

export const $CreateUserData = $UserData.pick({

    email: true,

    firstName: true,

    lastName: true,

    password: true

});

export type CreateUserData = z.infer<typeof $CreateUserData>;

export const $UpdateUserData = $CreateUserData.partial();
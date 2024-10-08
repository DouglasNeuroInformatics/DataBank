import { z } from 'zod';

const $CreateAdminDto = z.object({
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string(),
  role: z.literal('ADMIN')
});

export type CreateAdminDto = z.infer<typeof $CreateAdminDto>;

export const $ManualVerification = z.object({
  kind: z.literal('MANUAL')
});

export const $RegexEmailVerification = z.object({
  emailRegex: z.string(),
  kind: z.literal('REGEX_EMAIL')
});

export const $ConfirmEmailVerification = z.object({
  kind: z.literal('CONFIRM_EMAIL')
});

export const $UserVerification = z.discriminatedUnion('kind', [
  $ManualVerification,
  $RegexEmailVerification,
  $ConfirmEmailVerification
]);
export type UserVerification = z.infer<typeof $UserVerification>;

export const $SetupConfig = z.object({
  userVerification: $UserVerification
});
export type SetupConfig = z.infer<typeof $SetupConfig>;

export const $SetupDto = z.object({
  admin: $CreateAdminDto,
  setupConfig: $SetupConfig
});
export type SetupDto = z.infer<typeof $SetupDto>;

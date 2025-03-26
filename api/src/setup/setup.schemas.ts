import { z } from 'zod';

type CreateAdminData = z.infer<typeof $CreateAdminData>;
const $CreateAdminData = z.object({
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string()
});

const $ManualVerification = z.object({
  kind: z.literal('MANUAL')
});

const $RegexEmailVerification = z.object({
  emailRegex: z.string(),
  kind: z.literal('REGEX_EMAIL')
});

const $ConfirmEmailVerification = z.object({
  kind: z.literal('CONFIRM_EMAIL')
});

const $UserVerification = z.union([$ManualVerification, $RegexEmailVerification, $ConfirmEmailVerification]);

const $SetupOptions = z.object({
  admin: $CreateAdminData,
  userVerification: $UserVerification
});

type SetupOptions = z.infer<typeof $SetupOptions>;

export type { CreateAdminData, SetupOptions };
export { $CreateAdminData, $SetupOptions };

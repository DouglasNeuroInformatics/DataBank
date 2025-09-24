import { z } from 'zod/v4';

type $SetupState = z.infer<typeof $SetupState>;
const $SetupState = z.object({
  isSetup: z.boolean()
});

type $CreateAdminData = z.infer<typeof $CreateAdminData>;
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

const $UserVerificationStrategy = z.union([$ManualVerification, $RegexEmailVerification, $ConfirmEmailVerification]);

const $SetupConfig = z.object({
  isDemo: z.boolean(),
  verificationStrategy: $UserVerificationStrategy
});

type $SetupOptions = z.infer<typeof $SetupOptions>;
const $SetupOptions = z.object({
  admin: $CreateAdminData,
  setupConfig: $SetupConfig
});

export { $CreateAdminData, $SetupOptions, $SetupState };

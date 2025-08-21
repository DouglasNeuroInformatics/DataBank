import z from 'zod/v4';

const $CreateAccount = z.object({
  datasetId: z.string().array(),
  email: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z.string().min(1)
});
type $CreateAccount = z.infer<typeof $CreateAccount>;

const $LoginCredentials = z.object({
  email: z.string(),
  password: z.string()
});
type $LoginCredentials = z.infer<typeof $LoginCredentials>;

const $VerifyAccount = z.object({
  code: z.number()
});
type $VerifyAccount = z.infer<typeof $VerifyAccount>;

const $AuthPayload = z.object({
  accessToken: z.string()
});
type $AuthPayload = {
  accessToken: string;
};

const $EmailConfirmationProcedureInfo = z.object({
  /** The number of previous attempts to verify this code */
  attemptsMade: z.number(),

  /** The unix timestamp after which the code will be invalidated */
  expiry: z.date()
});
type $EmailConfirmationProcedureInfo = z.infer<typeof $EmailConfirmationProcedureInfo>;

export { $AuthPayload, $CreateAccount, $EmailConfirmationProcedureInfo, $LoginCredentials, $VerifyAccount };

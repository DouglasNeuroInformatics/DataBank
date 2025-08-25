import { z } from 'zod/v4';

const $UserRole = z.enum(['ADMIN', 'STANDARD']);

const $CreateUser = z.object({
  confirmedAt: z.coerce.date().optional(),

  datasetId: z.string().array(),

  email: z.email(),

  firstName: z.string().min(1),

  lastName: z.string().min(1),

  password: z.string(), // TO_DO: let user configure how strong the password should be

  role: z.optional($UserRole),

  verifiedAt: z.coerce.date().nullable().optional()
});

type User = {
  confirmedAt: null | number | undefined;
  creationTime?: number;
  email: string;
  firstName: string;
  lastName: string;
  role: $UserRole;
  verifiedAt: null | number | undefined;
};

type $CreateUser = z.infer<typeof $CreateUser>;

const $UpdateUser = $CreateUser.partial();

const $CurrentUser = z.object({
  confirmedAt: z.date().nullish(),
  datasetId: z.string().array(),
  email: z.string(),
  firstName: z.string(),
  id: z.string(),
  lastName: z.string(),
  role: z.optional($UserRole),
  verifiedAt: z.date().nullish()
});
type $CurrentUser = z.infer<typeof $CurrentUser>;

type $UpdateUser = z.infer<typeof $UpdateUser>;

type $UserRole = z.infer<typeof $UserRole>;

export { $CreateUser, $CurrentUser, $UpdateUser, $UserRole };
export type { User };

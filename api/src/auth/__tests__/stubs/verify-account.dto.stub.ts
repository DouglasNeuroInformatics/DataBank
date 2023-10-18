import type { VerifyAccountDto } from '@/auth/dto/verify-account.dto';

export const verifyAccountStubFactory = (): VerifyAccountDto => ({ code: 123 });

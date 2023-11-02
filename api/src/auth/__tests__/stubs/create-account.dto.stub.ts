import type { CreateAccountDto } from '@/auth/dto/create-account.dto';

export const createAccountDtoStubFactory = (): CreateAccountDto => ({
  email: '123@email.com',
  firstName: 'John',
  lastName: 'Doe',
  password: '123Password'
});

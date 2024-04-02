import type { CreateAccountDto } from '@/auth/dto/create-account.dto';

export const createAccountDtoStubFactory = (): CreateAccountDto => ({
  datasetId: [],
  email: '123@email.com',
  firstName: 'John',
  lastName: 'Doe',
  password: '123Password'
});

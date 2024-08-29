import type { CreateUserDto } from '@/users/zod/user';

export const createUserDtoStubFactory = (): CreateUserDto => ({
  datasetId: [],
  email: 'johnsmith@gmail.com',
  firstName: 'John',
  lastName: 'Smith',
  password: 'Password123',
  role: 'ADMIN'
});

import { $CreateUser } from '@databank/core';

export const createUserDtoStubFactory = (): $CreateUser => ({
  datasetId: [],
  email: 'johnsmith@gmail.com',
  firstName: 'John',
  lastName: 'Smith',
  password: 'Password123',
  role: 'ADMIN'
});

import { $CreateUser } from '@databank/core';

export const createUserDtoStubFactory = (): $CreateUser => ({
  datasetIds: [],
  email: 'johnsmith@gmail.com',
  firstName: 'John',
  lastName: 'Smith',
  password: 'Password123',
  role: 'ADMIN'
});

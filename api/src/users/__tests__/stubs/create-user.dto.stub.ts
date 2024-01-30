import type { CreateUserDto } from "@/users/schemas/user";

export const createUserDtoStubFactory = (): CreateUserDto => ({
  email: 'johnsmith@gmail.com',
  firstName: 'John',
  lastName: 'Smith',
  password: 'Password123',
  role: 'ADMIN',
});

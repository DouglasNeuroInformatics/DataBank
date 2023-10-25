import type { CreateUserDto } from '@/users/dto/create-user.dto';

export const createUserDtoStubFactory = (): CreateUserDto => ({
  confirmedAt: Date.now(),
  email: 'johnsmith@gmail.com',
  firstName: 'John',
  isVerified: true,
  lastName: 'Smith',
  password: 'Password123',
  role: 'admin',
  verifiedAt: Date.now()
});

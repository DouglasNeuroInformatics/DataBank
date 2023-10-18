import type { CurrentUser } from '@databank/types';

export const currentUserStubFactory = (): CurrentUser => ({
  email: 'test@example.com',
  firstName: 'Test',
  id: '123',
  isVerified: true,
  lastName: 'User',
  role: 'standard'
});

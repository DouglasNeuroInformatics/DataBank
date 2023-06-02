import { useContext } from 'react';

import { AuthContext } from '@/context/Auth';

export function useAuth() {
  return useContext(AuthContext);
}

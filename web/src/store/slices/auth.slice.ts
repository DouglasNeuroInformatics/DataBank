import type { $CurrentUser } from '@databank/core';
import { jwtDecode } from 'jwt-decode';

import type { AuthSlice, SliceCreator } from '../types';

export const createAuthSlice: SliceCreator<AuthSlice.State> = (set) => {
  return {
    act: {
      login: (accessToken) => {
        const currentUser = jwtDecode<$CurrentUser>(accessToken);
        set((state) => {
          state.auth.ctx = { accessToken, currentUser } satisfies AuthSlice.AuthorizedContext;
        });
      },
      logout: () => {
        set((state) => {
          state.auth.ctx = {} satisfies AuthSlice.UnauthorizedContext;
        });
      }
    },
    ctx: {} satisfies AuthSlice.UnauthorizedContext
  };
};

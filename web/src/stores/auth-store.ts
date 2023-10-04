import type { CurrentUser } from '@databank/types';
import jwtDecode from 'jwt-decode';
import { create } from 'zustand';

export type AuthStore = {
  accessToken: null | string;
  currentUser: CurrentUser | null;
  logout: () => void;
  setAccessToken: (accessToken: string) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  currentUser: null,
  logout: () => {
    set({ accessToken: null, currentUser: null });
  },
  setAccessToken: (accessToken) => {
    const currentUser = jwtDecode<CurrentUser>(accessToken);
    set({ accessToken, currentUser });
  }
}));

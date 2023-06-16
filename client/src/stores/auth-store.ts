import { CurrentUser } from '@databank/types';
import jwtDecode from 'jwt-decode';
import { create } from 'zustand';

export interface AuthStore {
  accessToken: string | null;
  setAccessToken: (accessToken: string) => void;
  currentUser: CurrentUser | null;
  setCurrentUser: (currentUser: CurrentUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  setAccessToken: (accessToken) => {
    const currentUser = jwtDecode<CurrentUser>(accessToken);
    set({ accessToken, currentUser });
  },
  currentUser: null,
  setCurrentUser: (currentUser) => {
    set({ currentUser });
  },
  logout: () => {
    set({ accessToken: null, currentUser: null });
  }
}));

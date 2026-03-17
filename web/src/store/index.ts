import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { createAuthSlice } from './slices/auth.slice';

import type { AppStore } from './types';

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      immer((...args) => ({
        auth: createAuthSlice(...args)
      })),
      {
        name: 'data-bank',
        partialize: () => ({}),
        storage: createJSONStorage(() => sessionStorage),
        version: 1
      }
    )
  )
);

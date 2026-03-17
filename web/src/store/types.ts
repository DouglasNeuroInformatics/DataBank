import { $CurrentUser } from '@databank/core';
import type { Simplify } from 'type-fest';
import type { StateCreator } from 'zustand';

export namespace AuthSlice {
  export type AuthorizedContext = {
    accessToken: string;
    currentUser: $CurrentUser;
  };

  export type UnauthorizedContext = {
    accessToken?: never;
    currentUser?: never;
  };

  type Actions = {
    login: (accessToken: string) => void;
    logout: () => void;
  };

  export type Context = AuthorizedContext | UnauthorizedContext;

  export type State = {
    act: Actions;
    ctx: Context;
  };
}

export type AppStore = Simplify<{ auth: AuthSlice.State }>;

export type SliceCreator<T extends { [key: string]: unknown }> = StateCreator<
  AppStore,
  [['zustand/devtools', never], ['zustand/persist', any], ['zustand/immer', never]],
  [],
  T
>;

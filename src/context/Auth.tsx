'use client';

import React, { createContext } from 'react';

export type Auth = {
  accessToken: string | null;
};

export const AuthContext = createContext<Auth>({
  accessToken: null
});

export const AuthProvider = ({ children, ...value }: Auth & { children: React.ReactNode }) => (
  <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
);

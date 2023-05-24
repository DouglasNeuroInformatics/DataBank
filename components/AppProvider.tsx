'use client';

import React from 'react';

import { SessionProvider } from 'next-auth/react';

import { ClientTranslationsContext } from '@/context/ClientTranslations';
import { Translations } from '@/translations';

export interface AppProviderProps {
  children: React.ReactNode;
  translations: Translations;
}

export const AppProvider = ({ children, translations }: AppProviderProps) => {
  return (
    <SessionProvider>
      <ClientTranslationsContext.Provider value={translations}>{children}</ClientTranslationsContext.Provider>;
    </SessionProvider>
  );
};

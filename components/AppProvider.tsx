'use client';

import React from 'react';

import { ClientTranslationsContext } from '@/context/ClientTranslations';
import { Translations } from '@/typings/translations';

export interface AppProviderProps {
  children: React.ReactNode;
  translations: Translations;
}

export const AppProvider = ({ children, translations }: AppProviderProps) => {
  return <ClientTranslationsContext.Provider value={translations}>{children}</ClientTranslationsContext.Provider>;
};

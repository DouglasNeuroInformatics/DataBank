'use client';

import React, { createContext } from 'react';

import type translations from '@/translations/en.json';

export const ClientTranslationsContext = createContext<typeof translations>(null!);

export const ClientTranslationsProvider = ({ t, children }: { t: typeof translations; children: React.ReactNode }) => {
  return <ClientTranslationsContext.Provider value={t}>{children}</ClientTranslationsContext.Provider>;
};

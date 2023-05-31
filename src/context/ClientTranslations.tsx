'use client';

import React, { createContext } from 'react';

import { type Translations } from '@/typings/translations';

export const ClientTranslationsContext = createContext<Translations>(null!);

export const ClientTranslationsProvider = (props: { translations: Translations; children: React.ReactNode }) => (
  <ClientTranslationsContext.Provider value={props.translations}>{props.children}</ClientTranslationsContext.Provider>
);

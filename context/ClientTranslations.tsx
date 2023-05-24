'use client';

import { createContext } from 'react';

import { Translations } from '@/translations';

export const ClientTranslationsContext = createContext<Translations>(null!);

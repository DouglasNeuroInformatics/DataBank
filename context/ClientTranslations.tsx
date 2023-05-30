'use client';

import { createContext } from 'react';

import { Translations } from '@/typings/translations';

export const ClientTranslationsContext = createContext<Translations>(null!);

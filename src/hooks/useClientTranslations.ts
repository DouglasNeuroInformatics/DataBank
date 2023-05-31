import 'client-only';

import { useContext } from 'react';

import { ClientTranslationsContext } from '@/context/ClientTranslations';

export function useClientTranslations() {
  return useContext(ClientTranslationsContext);
}

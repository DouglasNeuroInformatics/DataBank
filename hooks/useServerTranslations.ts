import 'server-only';
import type { Locale } from '@/lib/i18n';

const translations = {
  en: () => import('@/translations/en.json').then((module) => module.default),
  fr: () => import('@/translations/fr.json').then((module) => module.default)
};

export function useServerTranslations(locale: Locale) {
  return translations[locale]();
}

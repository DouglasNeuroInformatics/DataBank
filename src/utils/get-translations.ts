import 'server-only';
import type { Locale } from '@/lib/i18n';

const translations = {
  en: () => import('@/translations/en.json').then((module) => module.default),
  fr: () => import('@/translations/fr.json').then((module) => module.default)
};

export async function getTranslations(locale: Locale) {
  try {
    return translations[locale]();
  } catch (err) {
    console.error(locale, translations[locale]);
    throw err;
  }
}

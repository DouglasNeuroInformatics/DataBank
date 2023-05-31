export type Locale = 'en' | 'fr';

export type I18N = {
  defaultLocale: Locale;
  locales: Locale[];
  nativeNames: {
    [K in Locale]: string;
  };
};

export const i18n: I18N = {
  defaultLocale: 'en' satisfies Locale as Locale,
  locales: ['en', 'fr'] satisfies Locale[] as Locale[],
  nativeNames: {
    en: 'English',
    fr: 'Français'
  }
};

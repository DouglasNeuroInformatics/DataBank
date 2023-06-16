// import the original type declarations
import 'i18next';

// import all namespaces (for the default language, only)
import translations from '../../public/locales/en/translations.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translations';
    resources: {
      translations: typeof translations;
    };
  }
}

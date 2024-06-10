// import the original type declarations
// import all namespaces (for the default language, only)
import translation from '../../public/locales/en/translation.json';

import 'i18next';

declare module 'i18next' {
  type CustomTypeOptions = {
    defaultNS: 'translation';
    resources: {
      translation: typeof translation;
    };
  };
}

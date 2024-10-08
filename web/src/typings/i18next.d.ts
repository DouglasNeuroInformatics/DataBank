import type { TranslatedResource } from '@douglasneuroinformatics/libui/i18n';

import common from '../translations/common.json';

import 'i18next';

declare module 'i18next' {
  // Extend CustomTypeOptions
  type CustomTypeOptions = {
    // custom namespace type, if you changed it
    defaultNS: 'common';
    // custom resources type
    resources: {
      common: TranslatedResource<typeof common>;
    };
    // other
  };
}

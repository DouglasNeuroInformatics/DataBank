/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/no-namespace */

import { i18n } from '@douglasneuroinformatics/libui/i18n';

import common from '../translations/common.json';

declare module '@douglasneuroinformatics/libui/i18n' {
  export namespace UserConfig {
    export interface Translations {
      common: typeof common;
    }
  }
}

i18n.init({
  translations: { common }
});

export default i18n;

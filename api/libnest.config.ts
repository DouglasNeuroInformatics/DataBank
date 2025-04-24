/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/consistent-type-definitions */

import * as fs from 'node:fs/promises';
import * as path from 'node:path';

import type { Locale } from '@databank/core';
import { defineUserConfig } from '@douglasneuroinformatics/libnest/user-config';

declare module '@douglasneuroinformatics/libnest/user-config' {
  export interface CustomTypeOptions {
    Locale: Locale;
  }
  export interface UserConfig extends InferUserConfig<typeof config> {}
}

const config = defineUserConfig({
  build: {
    onComplete: async () => {
      await fs.cp(
        path.resolve(import.meta.dirname, './src/i18n/translations'),
        path.resolve(import.meta.dirname, './dist/translations'),
        {
          recursive: true
        }
      );
      await fs.cp(
        path.resolve(import.meta.dirname, './src/setup/resources'),
        path.resolve(import.meta.dirname, './dist/resources'),
        {
          recursive: true
        }
      );
    },
    outfile: path.resolve(import.meta.dirname, './dist/app.js')
  },
  entry: () => import('./src/app.js')
});

export default config;

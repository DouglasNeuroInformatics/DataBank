import * as fs from 'node:fs/promises';
import * as path from 'node:path';

import type { $CurrentUser } from '@databank/core';
import { defineUserConfig } from '@douglasneuroinformatics/libnest/user-config';

import type { $Env } from './src/core/env.schema.js';
import type { RuntimePrismaClient } from './src/core/prisma.js';

declare module '@douglasneuroinformatics/libnest/user-config' {
  export namespace UserTypes {
    export interface Env extends $Env {}
    export interface Locales {
      en: true;
      fr: true;
    }
    export interface PrismaClient extends RuntimePrismaClient {}
    export interface RequestUser extends $CurrentUser {}
  }
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

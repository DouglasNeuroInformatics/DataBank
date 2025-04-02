import path from 'path';

import libnest from '@douglasneuroinformatics/libnest/testing/plugin';
import { defineProject, mergeConfig } from 'vitest/config';

import baseConfig from '../vitest.config.js';
export default mergeConfig(
  baseConfig,
  defineProject({
    plugins: [
      libnest({
        baseUrl: path.resolve(import.meta.dirname, 'src'),
        paths: {
          '@/*': ['*']
        }
      })
    ],
    root: import.meta.dirname,
    test: {
      globals: true,
      passWithNoTests: true,
      setupFiles: [path.resolve(import.meta.dirname, 'src/testing/setup.ts')]
    }
  })
);

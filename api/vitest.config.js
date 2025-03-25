import path from 'path';

import swc from 'unplugin-swc';
import { defineProject, mergeConfig } from 'vitest/config';

import baseConfig from '../vitest.config.js';

export default mergeConfig(
  baseConfig,
  defineProject({
    plugins: [
      swc.vite({
        jsc: {
          baseUrl: path.resolve(import.meta.dirname, 'src'),
          keepClassNames: true,
          parser: {
            decorators: true,
            dynamicImport: true,
            syntax: 'typescript'
          },
          paths: {
            '@/*': ['*']
          },
          target: 'es2022',
          transform: {
            decoratorMetadata: true,
            legacyDecorator: true
          }
        },
        minify: false,
        module: {
          type: 'es6'
        },
        sourceMaps: true
      })
    ],
    test: {
      globals: true,
      passWithNoTests: true,
      root: import.meta.dirname
    }
  })
);

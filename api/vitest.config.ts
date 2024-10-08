import path from 'path';

import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    swc.vite({
      jsc: {
        baseUrl: path.resolve(import.meta.dirname, 'src'),
        externalHelpers: true,
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
    }) as any
  ],
  test: {
    coverage: {
      include: ['src/**/*'],
      provider: 'v8',
      thresholds: {
        branches: 0,
        functions: 0,
        lines: 0,
        statements: 0
      }
    },
    globals: true,
    passWithNoTests: true,
    root: './',
    watch: false
  }
});

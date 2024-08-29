/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import module from 'module';

const require = module.createRequire(import.meta.url);

export const pl: typeof import('nodejs-polars/bin').default = require('nodejs-polars');

export type * from 'nodejs-polars/bin';

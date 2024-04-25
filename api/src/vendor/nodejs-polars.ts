import module from 'module';

const require = module.createRequire(import.meta.url);

export const pl: typeof import('nodejs-polars').default = require('nodejs-polars');

export type * from 'nodejs-polars';

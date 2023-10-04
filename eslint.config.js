// @ts-check

import path from 'node:path';
import url from 'node:url';

import { createConfig } from '@douglasneuroinformatics/eslint-config';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiConfig = createConfig({
  base: {
    env: 'node',
    filesRoot: 'api/src'
  },
  ts: {
    project: path.resolve(__dirname, 'api', 'tsconfig.json')
  }
});

const webConfig = createConfig({
  base: {
    env: 'browser',
    filesRoot: 'web/src'
  },
  jsx: true,
  ts: {
    project: path.resolve(__dirname, 'web', 'tsconfig.json')
  }
});

export default [...apiConfig, ...webConfig];

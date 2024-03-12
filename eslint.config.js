import { config } from '@douglasneuroinformatics/eslint-config';
import { reactConfig } from '@douglasneuroinformatics/eslint-config/configs/react';
import { typescriptConfig } from '@douglasneuroinformatics/eslint-config/configs/typescript';

export default config(
  {
    env: {
      browser: true,
      es2021: true,
      node: true
    }
  },
  reactConfig({
    fileRoots: ['web/src'],
    typescript: {
      enabled: true
    }
  }),
  typescriptConfig({
    fileRoots: ['api/src'],
    react: {
      enabled: false
    }
  })
);

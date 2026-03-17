import { config } from '@douglasneuroinformatics/eslint-config';

export default config(
  {
    env: {
      browser: true,
      es2021: true,
      node: true
    },
    react: {
      enabled: true,
      version: '18'
    },
    typescript: {
      enabled: true
    }
  },
  {
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/only-throw-error': 'off'
    }
  }
);

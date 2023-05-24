// @ts-check

const path = require('path');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['eslint:recommended', 'prettier'],
  env: {
    commonjs: true,
    node: true
  },
  parserOptions: {
    sourceType: 'module'
  },
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier'
      ],
      env: {
        browser: true,
        es2022: true
      },
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: path.resolve(__dirname, 'tsconfig.json')
      },
      plugins: ['import', 'react'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/restrict-plus-operands': 'off',
        '@typescript-eslint/restrict-template-expressions': [
          'error',
          {
            allowNumber: true,
            allowBoolean: true
          }
        ],
        'import/order': [
          'error',
          {
            alphabetize: {
              caseInsensitive: true,
              order: 'asc'
            },
            'newlines-between': 'always',
            pathGroups: [
              {
                group: 'external',
                pattern: 'react',
                position: 'before'
              },
              {
                group: 'external',
                pattern: '{next,next/**}',
                position: 'before'
              }
            ],
            pathGroupsExcludedImportTypes: ['react']
          }
        ],
        'sort-imports': [
          'error',
          {
            ignoreDeclarationSort: true
          }
        ],
        'no-alert': 'error',
        'no-console': ['error', { allow: ['warn', 'error'] }],
        'react/jsx-sort-props': [
          'error',
          {
            callbacksLast: true,
            shorthandFirst: true
          }
        ]
      },
      settings: {
        'import/extensions': ['.ts', '.tsx'],
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx']
        },
        'import/resolver': {
          typescript: true
        },
        react: {
          version: 'detect'
        }
      }
    }
  ]
};

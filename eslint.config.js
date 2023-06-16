import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import * as importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import globals from 'globals';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ['**/*.js', '**/*.cjs', '**/*.mjs', '**/*.ts', '**/*.tsx'],
    ignores: ['**/*/dist/*', '**/*/node_modules/*'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.node
      }
    },
    plugins: {
      import: importPlugin
    },
    rules: {
      ...js.configs.recommended.rules,
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/export': 'error',
      'import/no-named-as-default': 'warn',
      'import/no-named-as-default-member': 'warn',
      'import/no-duplicates': 'warn',
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
              pattern: '@nestjs/**',
              position: 'before'
            }
          ],
          pathGroupsExcludedImportTypes: ['@nestjs/**']
        }
      ],
      'sort-imports': [
        'error',
        {
          ignoreDeclarationSort: true
        }
      ]
    }
  },
  {
    files: ['**/*.jsx', '**/*.tsx'],
    languageOptions: {
      globals: {
        ...globals.browser
      }
    },
    plugins: {
      react: reactPlugin
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
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
              pattern: '{react,react-dom/**}',
              position: 'before'
            },
            {
              group: 'external',
              pattern: '{next,next/**}',
              position: 'before'
            }
          ],
          pathGroupsExcludedImportTypes: ['react', 'react-dom/**', 'next', 'next/**']
        }
      ],
      'no-alert': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function'
        }
      ],
      'react/jsx-sort-props': [
        'error',
        {
          callbacksLast: true,
          shorthandFirst: true
        }
      ],
      'react/prop-types': 'off'
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...tsPlugin.configs['eslint-recommended'].rules,
      ...tsPlugin.configs['recommended'].rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/restrict-plus-operands': 'off'
    },
    settings: {
      'import/extensions': ['.ts', '.tsx'],
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx']
      },
      'import/resolver': {
        node: true,
        typescript: true
      }
    }
  }
];

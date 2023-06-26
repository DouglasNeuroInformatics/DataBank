const path = require('path');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [path.resolve(__dirname, '..', '.eslintrc.cjs'), 'plugin:react/recommended'],
  env: {
    browser: true
  },
  parserOptions: {
    project: path.resolve(__dirname, 'tsconfig.json')
  },
  plugins: ['import', 'react'],
  rules: {
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
          }
        ],
        pathGroupsExcludedImportTypes: ['react', 'react-dom/**']
      }
    ],
    'no-alert': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function'
      }
    ],
    'react/react-in-jsx-scope': 'off',
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
    'import/extensions': ['.ts', '.tsx'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    react: {
      version: 'detect'
    }
  }
};

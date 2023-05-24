const path = require('path');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@douglasneuroinformatics'],
  parserOptions: {
    project: path.resolve(__dirname, 'tsconfig.json')
  },
  overrides: [
    {
      files: ['**/*.js'],
      env: {
        commonjs: true,
        node: true
      }
    }
  ],
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

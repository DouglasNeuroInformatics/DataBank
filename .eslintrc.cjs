/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['eslint:recommended', 'prettier'],
  ignorePatterns: ['**/*/dist/*', '**/*/node_modules/*'],
  env: {
    es2020: true,
    'shared-node-browser': true
  },
  parserOptions: {
    sourceType: 'module'
  },
  plugins: ['import'],
  rules: {
    'import/exports-last': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/order': [
      'error',
      {
        alphabetize: {
          caseInsensitive: true,
          order: 'asc'
        },
        'newlines-between': 'always'
      }
    ],
    'sort-imports': [
      'error',
      {
        ignoreDeclarationSort: true
      }
    ]
  },
  overrides: [
    {
      extends: ['eslint:recommended'],
      files: ['**/*.js', '**/*.cjs'],
      env: {
        commonjs: true,
        node: true
      }
    },
    {
      files: ['**/*.{ts,tsx}'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking'
      ],
      parser: '@typescript-eslint/parser',
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
        '@typescript-eslint/no-misused-promises': [
          'error',
          {
            checksVoidReturn: false
          }
        ]
      },
      settings: {
        'import/extensions': ['.ts'],
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts']
        },
        'import/resolver': {
          typescript: true
        }
      }
    }
  ]
};

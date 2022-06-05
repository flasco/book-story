// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/jsx-runtime',
    'plugin:react/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
  },
  plugins: ['react', '@typescript-eslint', 'import'],
  rules: {
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'react/react-in-jsx-scope': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.jsx'] }],
    'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],
    'import/order': [
      'error',
      {
        'newlines-between': 'always-and-inside-groups',
        pathGroups: [
          {
            pattern: '@/**',
            group: 'external',
            position: 'after',
          },
        ],
      },
    ],
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'react/require-default-props': 0,
    'no-use-before-define': ['error', { functions: false, classes: false, variables: true }],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};

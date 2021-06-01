module.exports = {
  rules: {
    quotes: ['error', 'single'],
    eqeqeq: [
      'error',
      'always',
      {
        null: 'ignore',
      },
    ],
  },
  env: {
    node: true,
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      extends: ['eslint:recommended', 'plugin:prettier/recommended'],
    },
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:prettier/recommended',
        'prettier/react',
        'prettier/@typescript-eslint',
        'plugin:@typescript-eslint/recommended',
        'eslint:recommended',
        'plugin:react/recommended',
      ],
      parser: '@typescript-eslint/parser',
      plugins: ['react', '@typescript-eslint'],

      rules: {
        // @fixable 必须使用 === 或 !==，禁止使用 == 或 !=，与 null 比较时除外
        '@typescript-eslint/indent': ['error', 2],
        // 类和接口的命名必须遵守帕斯卡命名法，比如 PersianCat
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/no-unused-vars': 2,
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/interface-name-prefix': 0,
        '@typescript-eslint/no-use-before-define': 0,
        'react/no-children-prop': 0,
        'react/prop-types': 0,
        '@typescript-eslint/explicit-module-boundary-types': 0,
        'react/jsx-uses-react': 0,
        'react/react-in-jsx-scope': 0,
      },
    },
  ],
};

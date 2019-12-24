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
  settings: {
    react: {
      version: '16.8.0', // React version, default to the latest React stable release
    },
  },
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      parser: 'babel-eslint',
      extends: ['plugin:prettier/recommended', 'plugin:react/recommended'],
      plugins: ['react'],
    },
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:prettier/recommended',
        'prettier/react',
        'prettier/@typescript-eslint',
        'plugin:@typescript-eslint/recommended',
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
        '@typescript-eslint/indent': 0,
      },
    },
  ],
};

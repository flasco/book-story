module.exports = {
  processors: [],
  plugins: [],
  extends: 'stylelint-config-standard', // 这是官方推荐的方式
  rules: {
    'at-rule-empty-line-before': 'always',
    'block-no-empty': true,
    'selector-pseudo-class-no-unknown': null,
    'selector-pseudo-element-colon-notation': null,
    'custom-property-empty-line-before': null,
    'number-leading-zero': 'never',
    indentation: [
      2,
      {
        severity: 'warning',
      },
    ],
  },
};

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    quotes: [1, 'single'],
    semi: [1, 'never'],
    'max-len': 'off',
    'linebreak-style': 'off',
    'no-restricted-syntax': 'off',
    'vue/no-unused-components': 'warn',
    '@typescript-eslint/no-empty-function': 'off',
    'no-unused-expressions': 'off',
    'no-debugger': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'import/no-extraneous-dependencies': 'off',
    'global-require': 'off',
    'no-console': 'off',
    'no-underscore-dangle': 'off',
    'no-shadow': 'off',
    'func-names': 'off',
    'no-plusplus': 'off',
    'no-param-reassign': 'off',
    'vue/no-mutating-props': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-var-requires': 'off'
  },
}

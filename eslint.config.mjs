import withNuxt from './.nuxt/eslint.config.mjs';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default withNuxt({
  files: ['**/*.ts', '**/*.mjs', '**/*.js', '**/*.vue'],
  rules: {
    curly: ['error', 'multi-line', 'consistent'],
    quotes: [
      2,
      'single',
      {
        avoidEscape: true,
      },
    ],
    'max-len': [
      2,
      150,
      2,
      {
        ignoreComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreRegExpLiterals: true,
      },
    ],
    'no-plusplus': [
      2,
      {
        allowForLoopAfterthoughts: true,
      },
    ],
    'newline-before-return': 2,
    'object-curly-newline': [
      'error',
      {
        consistent: true,
      },
    ],
    'no-console': 1,
    'no-alert': 1,
    semi: [
      'error',
      'always',
      {
        omitLastInOneLineBlock: true,
      },
    ],
    'comma-dangle': ['error', 'always-multiline'],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true,
      },
    ],
    'vue/multi-word-component-names': 'off',
    'vue/html-self-closing': 'off',
    'vue/no-v-html': 'off',
    'vue/no-v-text-v-html-on-component': 'error',
    'vue/no-duplicate-attributes': [
      'error',
      {
        allowCoexistClass: true,
        allowCoexistStyle: true,
      },
    ],
    'no-useless-return': 'off',
    'arrow-parens': ['error', 'always'],
  },
  plugins: {
    ...eslintPluginPrettierRecommended.plugins,
  },
});

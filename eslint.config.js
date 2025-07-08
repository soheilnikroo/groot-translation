const globals = require('globals');
const jestPlugin = require('eslint-plugin-jest');
const snappConfig = require('eslint-config-snapp');
const tailwindPlugin = require('eslint-plugin-tailwindcss');
const transylvaniaPlugin = require('eslint-plugin-transylvania');

module.exports = [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...jestPlugin.environments.globals,
      },
    },
    ignores: ['src/components/ui/*'],
    plugins: {
      jest: jestPlugin,
      tailwindcss: tailwindPlugin,
      transylvania: transylvaniaPlugin,
    },
    settings: snappConfig.settings,
    rules: {
      // Eslint Core
      camelcase: 'off',
      'no-param-reassign': 'off',

      // TypeScript Eslint
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
        },
      ],

      // React
      'react/jsx-filename-extension': 'off',

      // Miscellaneous
      'import/no-extraneous-dependencies': 'off',
      'prettier/prettier': 'off',
      'no-restricted-imports': ['error'],
      'jest/no-done-callback': 'off',

      // Including rules from plugins
      ...jestPlugin.configs.recommended.rules,
      ...snappConfig.rules,
      ...tailwindPlugin.configs.recommended.rules,
      ...transylvaniaPlugin.configs.recommended.rules,
    },
  },
];

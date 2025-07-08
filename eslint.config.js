const globals = require('globals');
const jestPlugin = require('eslint-plugin-jest');
const tailwindPlugin = require('eslint-plugin-tailwindcss');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

function convertToFlatGlobals(obj) {
  return Object.fromEntries(Object.keys(obj).map(key => [key, 'readonly']));
}

module.exports = [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json'], // only if you're using type-aware rules
      },
      globals: {
        ...convertToFlatGlobals(globals.browser),
        ...convertToFlatGlobals(globals.es2021),
        ...convertToFlatGlobals(jestPlugin.environments.globals),
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      jest: jestPlugin,
      tailwindcss: tailwindPlugin,
    },
    rules: {
      camelcase: 'off',
      'no-param-reassign': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      'react/jsx-filename-extension': 'off',
      'import/no-extraneous-dependencies': 'off',
      'prettier/prettier': 'off',
      'no-restricted-imports': ['error'],
      'jest/no-done-callback': 'off',
      ...jestPlugin.configs.recommended.rules,
      ...tailwindPlugin.configs.recommended.rules,
    },
  },
];

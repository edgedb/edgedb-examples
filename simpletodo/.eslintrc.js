module.exports = {
  env: { browser: true, node: true },
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'import',
    'simple-import-sort',
    'unused-imports',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    // these rules are all dumb
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-empty-interface': 'off',

    // no duplicates
    'no-duplicate-imports': 'off', // use import/no-duplicates instead
    'import/no-duplicates': 'warn', // capable of consolidating imports

    // import sorting
    'sort-imports': 'off', // we use eslint-plugin-import instead
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',

    // remove unused imports
    '@typescript-eslint/no-unused-vars': 'off', // not capable of autofix
    'unused-imports/no-unused-imports': 'warn',
  },
};

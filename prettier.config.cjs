// @ts-check
/** @type {import("prettier").Config} */
const config = {
  overrides: [
    {
      files: ['.prettierrc', '.babelrc', '.eslintrc', '.stylelintrc'],
      options: {
        parser: 'json'
      }
    },
    {
      files: ['**/*.exml', '**/*.xml'],
      options: {
        parser: 'html'
      }
    }
  ],
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'none',
  arrowParens: 'avoid',
  printWidth: 120
};

module.exports = config;

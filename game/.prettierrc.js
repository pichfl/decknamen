module.exports = {
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  endOfLine: 'lf',
  printWidth: 80,
  bracketSpacing: true,
  overrides: [
    {
      files: '**/*.hbs',
      options: {
        singleQuote: false,
      },
    },
  ],
};

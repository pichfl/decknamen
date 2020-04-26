'use strict';

module.exports = {
  extends: 'octane',

  plugins: ['ember-template-lint-plugin-css-modules'],

  rules: {
    'no-passed-in-event-handlers': true,

    // Custom rules
    'no-bare-strings': true,
    'css-modules/no-class': true,
    'css-modules/static-local-class': true,
    'no-negated-condition': false,
  },

  overrides: [
    // Make it easier to write freestyle usage components
    {
      files: ['lib/freestyle/**/*.hbs'],
      rules: {
        'no-curly-component-invocation': false,
        'no-bare-strings': false,
        'no-inline-styles': false,
      },
    },
    // Ignore bare strings in tests
    {
      files: ['tests/**/*.js'],
      rules: {
        'no-bare-strings': false,
      },
    },
  ],
};

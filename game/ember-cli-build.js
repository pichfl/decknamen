'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    cssModules: {
      plugins: [
        require('postcss-normalize'),
        require('postcss-import')({
          path: ['node_modules'],
        }),
        require('autoprefixer'),
        require('postcss-preset-env'),
      ],
      headerModules: ['tix/styles/app.css'],
    },
  });

  return app.toTree();
};

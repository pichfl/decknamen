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
    fingerprint: {
      extensions: ['js', 'css', 'png', 'jpg', 'gif', 'map', 'json', 'mp3'],
      generateAssetMap: true,
      fingerprintAssetMap: true,
    },
  });

  return app.toTree();
};

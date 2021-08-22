'use strict';

// const { Webpack } = require('@embroider/webpack');
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    babel: {
      plugins: [require.resolve('ember-auto-import/babel-plugin')],
      include: [
        'proposal-nullish-coalescing-operator',
        'proposal-optional-chaining',
        'proposal-private-methods',
        'proposal-class-properties',
      ],
    },
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
  // return require('@embroider/compat').compatBuild(app, Webpack, {
  //   compatAdapters: new Map([['ember-get-config', null]]),
  // });
};

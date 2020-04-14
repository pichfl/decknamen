'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const purgeCSS = {
    module: require('@fullhuman/postcss-purgecss'),
    options: {
      content: [
        // add extra paths here for components/controllers which include tailwind classes
        './app/index.html',
        './app/templates/**/*.hbs',
      ],
      defaultExtractor: (content) => content.match(/[A-Za-z0-9-_:/]+/g) || [],
    },
  };

  let app = new EmberApp(defaults, {
    postcssOptions: {
      compile: {
        plugins: [
          {
            module: require('postcss-import'),
            options: {
              path: ['node_modules'],
            },
          },
          require('tailwindcss')('./config/tailwind.js'),
          require('autoprefixer'),
          ...(EmberApp.env() === 'production' ? [purgeCSS] : []),
        ],
      },
    },
  });

  return app.toTree();
};

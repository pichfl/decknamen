'use strict';

module.exports = function (environment) {
  let ENV = {
    modulePrefix: 'game',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {},
      EXTEND_PROTOTYPES: false,
    },

    APP: {
      server: ':3000',
      locales: ['en', 'de', 'es', 'nl'],
    },

    fontawesome: {
      defaultPrefix: 'fas',
    },
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    ENV.locationType = 'none';
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;
    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production' || environment === 'heroku') {
    ENV.APP.server = 'https://decknamen.herokuapp.com';
  }

  return ENV;
};

import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
import { library } from '@fortawesome/fontawesome-svg-core';

// spy by Adrien Coquet from the Noun Project
library.add({
  prefix: 'fas',
  iconName: 'spy',
  icon: [
    64,
    64,
    [],
    'e001',
    'M37.687 39.034c2.692-.74 11.373-2.692 18.776 0 2.22 1.076 3.163 1.615 1.278 4.172-1.548 2.625-1.615 12.517-11.306 12.517-9.69 0-11.71-6.258-11.71-9.017 0-.404 0-.74-.067-1.01-.269-1.413-1.48-2.355-2.894-2.355a2.959 2.959 0 00-2.893 2.355c-.068.337-.068.673-.068 1.01 0 2.691-1.951 9.017-11.71 9.017-9.69 0-9.758-9.96-11.305-12.517-1.548-2.557-.606-3.096 1.615-4.172 7.402-2.692 16.151-.74 18.776 0 2.512.753 4.321 1.038 4.551 1.073l.025.003a6.917 6.917 0 002.355 0s1.952-.336 4.577-1.076zM43.07 7c2.962 0 5.653 1.884 6.663 4.644l4.778 12.92h5.99c1.884 0 3.432 1.481 3.499 3.433a3.447 3.447 0 01-3.432 3.432H3.432A3.447 3.447 0 010 27.997a3.447 3.447 0 013.432-3.432h5.922l4.778-12.921C15.21 8.817 17.834 7 20.795 7z',
  ],
});

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);

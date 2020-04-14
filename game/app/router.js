import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('lobby', {
    path: ':lobby_id',
  }, function() {
    this.route('game');
  });
});

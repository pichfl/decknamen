import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route(
    'game',
    {
      path: ':room_id',
    },
    function () {
      this.route('lobby');
      this.route('over');
    }
  );
});

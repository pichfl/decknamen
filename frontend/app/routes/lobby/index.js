import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class LobbyIndexRoute extends Route {
  @service intl;

  titleToken() {
    return this.intl.t('lobbyIndex.title');
  }
}

import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class LobbyIndexRoute extends Route {
  @service intl;
  @service socket;

  titleToken() {
    return this.intl.t('lobbyIndex.title');
  }

  activate() {
    this._onRoomSync = (data) => {
      if (data.cards?.length ?? 0 > 0) {
        this.transitionTo('lobby.game');
      }
    };

    this.socket.subscribe('room.sync', this._onRoomSync);
  }

  deactivate() {
    this.controller.isLoading = false;
    this.socket.unsubscribe('room.sync', this._onRoomSync);
  }
}

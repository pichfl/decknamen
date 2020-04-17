import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class LobbyIndexRoute extends Route {
  @service intl;
  @service socket;

  beforeModel() {
    if (this.socket.cards?.length) {
      this.replaceWith('lobby.game');
    }
  }

  activate() {
    this._onRoomSync = (data) => {
      if (Number(data.cards?.length) > 0) {
        this.replaceWith('lobby.game');
      }
    };

    this.socket.subscribe('room.sync', this._onRoomSync);
  }

  deactivate() {
    this.controller.isLoading = false;
    this.socket.unsubscribe('room.sync', this._onRoomSync);
  }
}

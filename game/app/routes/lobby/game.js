import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class LobbyGameRoute extends Route {
  @service socket;

  afterModel() {
    if (this.socket.cards.length === 0) {
      this.replaceWith('lobby.index');
    }

    if (this.socket.current?.over === true) {
      this.replaceWith('game.over');
    }
  }

  activate() {
    this._onRoomSync = (data) => {
      if (Number(data.cards?.length) === 0) {
        this.replaceWith('lobby.index');
      }

      if (data.over === true) {
        this.replaceWith('game.over');
      }
    };

    this.socket.subscribe('room.sync', this._onRoomSync);
  }

  deactivate() {
    this.controller.isLoading = false;
    this.socket.unsubscribe('room.sync', this._onRoomSync);
  }
}

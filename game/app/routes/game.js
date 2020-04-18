import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class GameRoute extends Route {
  @service socket;
  @service user;

  async model({ room_id }) {
    await this.socket.connect(room_id, {
      ...this.user.data,
    });
  }

  activate() {
    this._onRoomSync = () => {
      if (this.socket.over === true) {
        this.replaceWith('game.over');

        return;
      }

      if (this.socket.cards.length < 0) {
        this.replaceWith('game.index');

        return;
      } else {
        this.replaceWith('game.lobby');

        return;
      }
    };

    this.socket.subscribe('room.sync', this._onRoomSync);
  }

  deactivate() {
    this.controller.isLoading = false;

    this.socket.unsubscribe('room.sync', this._onRoomSync);
  }
}

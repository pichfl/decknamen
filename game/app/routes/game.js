import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class GameRoute extends Route {
  @service socket;
  @service state;
  @service user;

  async model({ room_id }) {
    return this.state.connect(room_id);
  }

  activate() {
    this._onRoomSync = () => {
      if (!this.socket.room) {
        return;
      }

      if (this.state.over === true) {
        this.replaceWith('game.over');

        return;
      }

      this.replaceWith(
        this.state.cards.length > 0 ? 'game.index' : 'game.lobby'
      );
    };

    this.socket.subscribe('room.sync', this._onRoomSync);
  }

  deactivate() {
    this.socket.unsubscribe('room.sync', this._onRoomSync);
  }
}

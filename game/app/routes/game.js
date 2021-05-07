import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class GameRoute extends Route {
  @service socket;
  @service state;
  @service user;
  @service router;

  async model({ room_id }) {
    this.socket.room = room_id;

    await this.state.connect(room_id);

    return room_id;
  }

  activate() {
    this._onRoomSync = () => {
      if (!this.socket.room) {
        return;
      }

      if (this.state.over === true) {
        this.router.replaceWith('game.over');

        return;
      }

      this.router.replaceWith(
        this.state.cards.length > 0 ? 'game.index' : 'game.lobby'
      );
    };

    this.socket.subscribe('room.sync', this._onRoomSync);
  }

  deactivate() {
    this.socket.unsubscribe('room.sync', this._onRoomSync);
  }
}

import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class LobbyRoute extends Route {
  @service socket;
  @service intl;
  @service user;

  beforeModel() {
    // TODO: Jump into game if cards were found
  }

  async model({ lobby_id: room }) {
    await this.socket.connect(room, {
      ...this.user.data,
    });

    return {
      room,
    };
  }
}

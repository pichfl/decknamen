import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class GameLobbyRoute extends Route {
  @service socket;
  @service state;

  beforeModel() {
    if (!this.socket.room) {
      return;
    }

    if (this.state.cards.length > 0) {
      this.replaceWith('game.index');
    }

    if (this.state.over === true) {
      this.replaceWith('game.over');
    }
  }

  deactivate() {
    this.controller.isLoading = false;
  }
}

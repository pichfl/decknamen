import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';

export default class GameLobbyRoute extends Route {
  @service socket;
  @service state;
  @service router;

  beforeModel() {
    if (!this.socket.room) {
      return;
    }

    if (this.state.cards.length > 0) {
      this.router.replaceWith('game.index');
    }

    if (this.state.over === true) {
      this.router.replaceWith('game.over');
    }
  }

  deactivate() {
    const controller = getOwner(this).inject('controller:game.lobby');

    controller.isLoading = false;
  }
}

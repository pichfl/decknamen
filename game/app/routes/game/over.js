import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class GameOverRoute extends Route {
  @service socket;
  @service state;
  @service user;
  @service router;

  beforeModel() {
    if (!this.socket.room) {
      return;
    }

    if (this.state.over === true) {
      return;
    }

    if (this.state.cards.length > 0) {
      this.router.replaceWith('game.index');
    } else {
      this.router.replaceWith('game.lobby');
    }
  }
}

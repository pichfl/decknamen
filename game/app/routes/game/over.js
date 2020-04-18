import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class GameOverRoute extends Route {
  @service user;
  @service socket;

  beforeModel() {
    if (this.socket.over === true) {
      return;
    }

    if (this.socket.cards.length > 0) {
      this.replaceWith('game.index');
    } else {
      this.replaceWith('game.lobby');
    }
  }
}

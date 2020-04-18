import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class GameIndexRoute extends Route {
  @service socket;

  beforeModel() {
    if (this.socket.cards.length === 0) {
      this.replaceWith('game.lobby');
    }

    if (this.socket.over === true) {
      this.replaceWith('game.over');
    }
  }
}

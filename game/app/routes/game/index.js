import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class GameIndexRoute extends Route {
  @service socket;
  @service user;

  beforeModel() {
    if (this.socket.cards.length === 0) {
      this.replaceWith('game.lobby');

      return;
    }

    if (this.socket.over === true) {
      this.replaceWith('game.over');

      return;
    }

    if (this.socket.players[this.user.id].team === undefined) {
      this.transitionTo('index');

      return;
    }
  }
}

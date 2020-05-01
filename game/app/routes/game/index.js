import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class GameIndexRoute extends Route {
  @service socket;
  @service state;
  @service user;

  beforeModel() {
    if (!this.socket.room) {
      return;
    }

    if (this.state.cards.length === 0) {
      this.replaceWith('game.lobby');

      return;
    }

    if (this.state.over === true) {
      this.replaceWith('game.over');

      return;
    }

    if (this.state.players[this.user.id].team === undefined) {
      this.transitionTo('game.in-progress');

      return;
    }
  }
}

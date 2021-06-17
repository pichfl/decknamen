import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class GameIndexRoute extends Route {
  @service router;
  @service socket;
  @service state;
  @service user;

  beforeModel() {
    if (!this.socket.room) {
      return;
    }

    if (this.state.cards.length === 0) {
      this.router.replaceWith('game.lobby');

      return;
    }

    if (this.state.over === true) {
      this.router.replaceWith('game.over');

      return;
    }

    if (this.state.player.team === undefined) {
      this.router.transitionTo('game.in-progress');

      return;
    }
  }
}

import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class GameRoute extends Route {
  @service words;
  @service game;

  async model() {
    return this.game.state;
  }
}

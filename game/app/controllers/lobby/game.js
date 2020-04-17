import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { TEAMS } from 'game/utils/enums';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class LobbyGameController extends Controller {
  @service socket;
  @service user;

  @tracked cards = [];

  TEAMS = TEAMS;

  @action
  async onCardChange(card) {
    await this.socket.changeCard(card);
  }

  @action
  async doEndTurn() {
    await this.socket.endTurn();
  }

  @action
  async doEndGame() {
    await this.socket.endGame();
  }
}

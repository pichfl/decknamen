import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { TEAMS } from 'game/utils/enums';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class GameIndexController extends Controller {
  @service socket;
  @service user;
  @service intl;

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
    const confirmed = window.confirm(this.intl.t('gamePlay.action.confirmEnd'));

    if (!confirmed) {
      return;
    }

    await this.socket.reset();
  }
}

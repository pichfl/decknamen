import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { TEAMS, CARD_STATES } from 'game/utils/enums';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import ENV from 'game/config/environment';

export default class GameIndexController extends Controller {
  @service state;
  @service user;
  @service intl;

  @tracked cards = [];

  TEAMS = TEAMS;

  get isDevelopment() {
    return ENV.environment === 'development';
  }

  @action
  async onCardChange(card) {
    await this.state.changeCard(card);
  }

  @action
  async doEndTurn() {
    await this.state.endTurn();
  }

  @action
  async doEndGame() {
    const confirmed = window.confirm(this.intl.t('gamePlay.action.confirmEnd'));

    if (!confirmed) {
      return;
    }

    await this.state.reset();
  }

  @action
  async win() {
    this.state.current.cards = this.state.cards.map((card) => ({
      ...card,
      state:
        card.type === this.state.player.team
          ? CARD_STATES.UNCOVERED
          : card.state,
    }));

    await this.state.syncTask.perform();
  }
}

import Controller, { inject as controller } from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { TEAMS } from 'game/utils/enums';
import { action } from '@ember/object';

export default class LobbyGameController extends Controller {
  @controller lobby;

  @tracked cards = [];

  get currentTeam() {
    return TEAMS.TEAM_A;
  }

  @action
  onCardChange(card) {
    const oldIndex = this.cards.findIndex((c) => c.word === card.word);

    this.cards[oldIndex] = card;

    this.cards = [...this.cards];
  }
}

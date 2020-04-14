import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { TEAMS } from 'game/utils/enums';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class LobbyGameController extends Controller {
  @service socket;

  @tracked cards = [];

  get currentTeam() {
    return TEAMS.TEAM_A;
  }

  @action
  onCardChange(card) {
    const cards = [...this.socket.cards];
    const oldIndex = cards.findIndex((c) => c.word === card.word);

    cards.forEach((card) => {
      card.selected = false;
    });

    cards[oldIndex] = card;

    this.socket.syncCards(cards);
  }
}

import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { CARD_STATES } from 'game/utils/enums';

export default class GameTallyComponent extends Component {
  @service player;

  get totalTeamCards() {
    return this.args.cards.reduce((acc, card) => (card.type === this.player.team ? ++acc : acc), 0);
  }

  get uncoveredTeamCards() {
    return this.args.cards.reduce(
      (acc, card) => (card.type === this.player.team && card.state === CARD_STATES.COVERED ? ++acc : acc),
      0
    );
  }
}

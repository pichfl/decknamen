import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { CARD_STATES } from 'game/utils/enums';

export default class GameTallyComponent extends Component {
  @service user;

  get player() {
    return this.args.players[this.user.id];
  }

  get cards() {
    return this.args.cards || [];
  }

  get totalTeamCards() {
    return this.cards.reduce(
      (acc, card) => (card.type === this.player.team ? ++acc : acc),
      0
    );
  }

  get uncoveredTeamCards() {
    return this.cards.reduce(
      (acc, card) =>
        card.type === this.player.team && card.state === CARD_STATES.COVERED
          ? ++acc
          : acc,
      0
    );
  }
}

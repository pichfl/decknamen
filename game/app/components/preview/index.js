import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { shuffleCards } from 'game/services/state';
import { tracked } from '@glimmer/tracking';
import { CARD_STATES } from 'game/utils/enums';
import { action } from '@ember/object';

const randomBoolean = () => Math.random() < 0.5;

export default class GamePreviewComponent extends Component {
  @service state;
  @service words;

  @tracked cards = [];

  constructor() {
    super(...arguments);

    this.cards = shuffleCards([
      ...this.words.byId['english(Original)'].list,
      ...this.words.byId['english(Duet)'].list,
    ]).cards.map((card) => ({
      ...card,
      isLead: randomBoolean(),
      state: randomBoolean() ? CARD_STATES.COVERED : CARD_STATES.UNCOVERED,
    }));

    setInterval(() => {
      this.cards = this.cards.map((card) => ({
        ...card,
        state: randomBoolean() ? CARD_STATES.COVERED : CARD_STATES.UNCOVERED,
        selected: false,
      }));
    }, 3000);
  }

  @action
  noop() {}
}

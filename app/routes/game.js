import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { CARD_STATES, CARD_TYPES } from 'game/utils/enums';

export default class GameRoute extends Route {
  @service words;

  async model() {
    const cards = [];

    let words = [...this.words.byLanguage.en];

    for (let index = 0; index < 25; index++) {
      let word = words[Math.floor(Math.random() * words.length)];

      words = words.filter((w) => w != word);

      cards.push({
        type: Math.floor(Math.random() * 3),
        word,
        fail: false,
        state: Math.random() < 0.5 ? CARD_STATES.COVERED : CARD_STATES.UNCOVERED,
        selected: false,
      });
    }

    cards[Math.floor(Math.random() * 25)].type = CARD_TYPES.ABORT;

    const firstCovered = cards.find((c) => c.state === CARD_STATES.COVERED);

    // firstCovered.selected = true;

    return cards;
  }
}

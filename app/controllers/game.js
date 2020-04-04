import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class GameController extends Controller {
  @action
  onChange(card) {
    const oldIndex = this.model.findIndex(c => c.word === card.word);

    this.model[oldIndex] = card;

    this.model = [...this.model];
  }
}

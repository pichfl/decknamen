import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { nanoid } from 'nanoid';

export default class IndexController extends Controller {
  @service words;

  get randomToken() {
    return nanoid();
  }

  @action
  startGame(event) {
    event.preventDefault();
    console.log(event);

    this.transitionToRoute('game');
  }
}

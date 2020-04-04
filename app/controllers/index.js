import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class IndexController extends Controller {
  @action
  startGame(event) {
    event.preventDefault();
    console.log(event);

    this.transitionToRoute('game');
  }
}

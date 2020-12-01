import Controller from '@ember/controller';

export default class GameController extends Controller {
  get letitsnow() {
    return this.model.includes('winter');
  }
}

import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class LobbyController extends Controller {
  @tracked lobbyId = null;
  @tracked players = {};
}

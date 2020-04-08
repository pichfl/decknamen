import Controller, { inject as controller } from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { TEAMS } from 'game/utils/enums';

export default class LobbyGameController extends Controller {
  @controller lobby;

  @tracked cards = [];

  get currentTeam() {
    return TEAMS.TEAM_A;
  }
}

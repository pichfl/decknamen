import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { TEAMS } from 'game/utils/enums';

export default class LobbyGameRoute extends Route {
  @service intl;
  @service game;

  titleToken() {
    return this.intl.t('lobbyGame.title', {
      team: this.intl.t(
        this.controller.currentTeam === TEAMS.TEAM_A
          ? 'Teams.teamA'
          : 'Teams.teamB'
      ),
      tally: `/`,
    });
  }

  setupController(controller) {
    controller.cards = this.game.setup();
  }
}

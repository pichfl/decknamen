import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { TEAMS } from 'game/utils/enums';

export default class LobbyGameRoute extends Route {
  @service intl;
  @service socket;

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

  beforeModel() {
    console.log(this.socket.cards, this.socket.players);

    // TODO: FIX ME
    // if (this.socket.cards.length === 0) {
    //   this.replaceWith('lobby.index');
    // }
  }
}

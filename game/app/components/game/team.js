import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { TEAMS } from 'game/utils/enums';

const { TEAM_A, TEAM_B } = TEAMS;

const teamSorter = (a, b) => {
  if (a.lead) {
    return -1;
  }

  if (a.name > b.name) {
    return -1;
  }

  if (a.name < b.name) {
    return 1;
  }

  return 0;
};

export default class GameTeamComponent extends Component {
  @service user;
  @service socket;

  get teamA() {
    return Object.values(this.socket.players)
      .filter((player) => player.team === TEAM_A)
      .sort(teamSorter);
  }

  get teamB() {
    return Object.values(this.socket.players)
      .filter((player) => player.team === TEAM_B)
      .sort(teamSorter);
  }
}

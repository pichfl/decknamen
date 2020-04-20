import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { TEAMS } from 'game/utils/enums';
import { sortBy } from 'lodash-es';
import styles from './team.css';

const { TEAM_A, TEAM_B } = TEAMS;

const sortPlayers = (players, team) =>
  sortBy(
    Object.values(players).filter((player) => player.team === team),
    ['lead', 'name']
  );

export default class GameTeamComponent extends Component {
  @service user;
  @service socket;

  get teamList() {
    const teamA = {
      headline: 'Teams.teamA',
      players: sortPlayers(this.socket.players, TEAM_A),
      className: styles['team-a'],
    };
    const teamB = {
      headline: 'Teams.teamB',
      players: sortPlayers(this.socket.players, TEAM_B),
      className: styles['team-b'],
    };

    if (this.socket.totalCardsTeamA < this.socket.totalCardsTeamB) {
      return [teamB, teamA];
    }

    return [teamA, teamB];
  }
}

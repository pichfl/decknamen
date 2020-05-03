import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { sortBy } from 'lodash-es';
import styles from './team.css';

export default class GameTeamComponent extends Component {
  @service user;
  @service state;

  get teamList() {
    const statistics = this.state.statistics;

    const teamA = {
      headline: 'Teams.teamA',
      lead: this.state.leadTeamA,
      players: sortBy(this.state.playersTeamA, ['name']),
      className: styles['team-a'],
      total: statistics.teamA.total,
      uncovered: statistics.teamA.uncovered,
    };
    const teamB = {
      headline: 'Teams.teamB',
      lead: this.state.leadTeamB,
      players: sortBy(this.state.playersTeamB, ['name']),
      className: styles['team-b'],
      total: statistics.teamB.total,
      uncovered: statistics.teamB.uncovered,
    };

    if (statistics.teamA.total < statistics.teamB.total) {
      return [teamB, teamA];
    }

    return [teamA, teamB];
  }
}

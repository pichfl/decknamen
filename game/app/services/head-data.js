import HeadData from 'ember-cli-head/services/head-data';
import { inject as service } from '@ember/service';
import { TEAMS } from '../utils/enums';

export default class HeadDataService extends HeadData {
  @service state;

  get turnTeamA() {
    return this.state.turn === TEAMS.TEAM_A;
  }

  get turnTeamB() {
    return this.state.turn === TEAMS.TEAM_B;
  }
}

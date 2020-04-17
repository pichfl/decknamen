import { helper } from '@ember/component/helper';
import { TEAMS } from 'game/utils/enums';

export default helper(function isTeamA([team]) {
  return team === TEAMS.TEAM_A;
});

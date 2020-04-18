import { helper } from '@ember/component/helper';
import { TEAMS } from 'game/utils/enums';

export default helper(function isTeamB([team]) {
  return team === TEAMS.TEAM_B;
});

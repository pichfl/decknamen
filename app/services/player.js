import Service from '@ember/service';
import { /* CARD_STATES, CARD_TYPES, */ TEAMS } from 'game/utils/enums';

export default class PlayerService extends Service {
  isLead = true;

  team = 0;

  name = 'Florian';

  get inTeamA() {
    return this.team === TEAMS.A;
  }
}

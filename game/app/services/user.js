import Service, { inject as service } from '@ember/service';
import { nanoid } from 'nanoid';
import { TEAMS } from 'game/utils/enums';

export default class UserService extends Service {
  @service socket;

  get player() {
    return this.socket.players[this.id];
  }

  get isLead() {
    return this.player?.lead;
  }

  get inTeamA() {
    return this.player.team === TEAMS.TEAM_A;
  }

  get inTeamB() {
    return this.player.team === TEAMS.TEAM_B;
  }

  get id() {
    return this.data.id;
  }

  get name() {
    return this.data.name;
  }

  create() {
    if (this.data.id) {
      return;
    }

    this.data = {
      id: nanoid(),
      name: '',
    };
  }

  restore() {
    this.create();
  }

  get data() {
    return JSON.parse(window.localStorage.getItem('decknamen.user') || '{}');
  }

  set data(value) {
    return window.localStorage.setItem(
      'decknamen.user',
      JSON.stringify({
        ...this.user,
        ...value,
      })
    );
  }
}

import Service, { inject as service } from '@ember/service';
import { nanoid } from 'nanoid';
import { TEAMS } from 'game/utils/enums';

const { TEAM_A, TEAM_B } = TEAMS;

export default class UserService extends Service {
  @service state;

  get isLead() {
    return this.state.player?.lead || false;
  }

  get team() {
    return this.state.player?.team;
  }

  get inTeamA() {
    return this.state.player?.team === TEAM_A;
  }

  get inTeamB() {
    return this.state.player?.team === TEAM_B;
  }

  get id() {
    return this.data.id;
  }

  get name() {
    return this.data.name;
  }

  set name(value) {
    this.data = {
      ...this.data,
      name: value,
    };
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
    window.localStorage.setItem(
      'decknamen.user',
      JSON.stringify({
        ...this.user,
        ...value,
      })
    );
  }
}

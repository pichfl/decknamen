import Service from '@ember/service';
import { nanoid } from 'nanoid';
import { /* CARD_STATES, CARD_TYPES, */ TEAMS } from 'game/utils/enums';

export default class UserService extends Service {
  get inTeamA() {
    return this.team === TEAMS.A;
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

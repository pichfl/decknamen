import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { TEAMS } from 'game/utils/enums';

const fakePlayer = (id) => ({
  id,
  name: id,
  team: Math.random() < 0.5 ? TEAMS.TEAM_A : TEAMS.TEAM_B,
});

export default class LobbyRoute extends Route {
  @service socket;
  @service intl;
  @service user;

  async model({ lobby_id: room }) {
    await this.socket.connect(room);
    await this.socket.syncPlayers({
      ...this.socket.players,

      [this.user.id]: {
        ...this.user.data,
        team: undefined,
      },

      foo: { ...fakePlayer('foo') },
      bar: { ...fakePlayer('bar'), team: TEAMS.TEAM_B },
      baz: fakePlayer('baz'),
      bat: fakePlayer('bat'),
    });

    return {
      room,
    };
  }
}

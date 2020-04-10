import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { TEAMS } from 'game/utils/enums';

const fakePlayer = (id) => ({
  id,
  name: id,
  team: Math.random() < 0.5 ? TEAMS.TEAM_A : TEAMS.TEAM_B,
});

export default class LobbyRoute extends Route {
  @service connection;
  @service intl;
  @service user;

  async model({ lobby_id: lobbyId }) {
    await this.connection.connect();
    await this.connection.createRooms(lobbyId);

    const players = await this.connection.syncPlayers(lobbyId, {
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
      lobbyId,
      players,
    };
  }

  async setupController(controller, { players, lobbyId }) {
    controller.players = players;
    controller.lobbyId = lobbyId;

    this.connection.subscribe('sync.players', ({ data }) => {
      controller.players = { ...data };
    });
  }
}

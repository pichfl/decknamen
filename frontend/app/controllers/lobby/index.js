import Controller, { inject as controller } from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action, set } from '@ember/object';
import { TEAMS } from 'game/utils/enums';

export default class LobbyIndexController extends Controller {
  @controller lobby;

  @service connection;
  @service user;

  @tracked isEditMode = false;

  TEAMS = TEAMS;

  get playersList() {
    return Object.values(this.lobby.players);
  }

  get leadTeamA() {
    return this.playersList.find(
      (player) => player.team === TEAMS.TEAM_A && player.lead
    );
  }

  get leadTeamB() {
    return this.playersList.find(
      (player) => player.team === TEAMS.TEAM_B && player.lead
    );
  }

  get playersTeamA() {
    return this.playersList.filter(
      (player) => player.team === TEAMS.TEAM_A && !player.lead
    );
  }

  get playersTeamB() {
    return this.playersList.filter(
      (player) => player.team === TEAMS.TEAM_B && !player.lead
    );
  }

  get playersWaiting() {
    return this.playersList.filter((player) => player.team === undefined);
  }

  get canContinue() {
    return (
      this.playersWaiting.length === 0 &&
      this.playersTeamA.length > 0 &&
      this.playersTeamB.length > 0 &&
      !!this.leadTeamA &&
      !!this.leadTeamB
    );
  }

  @action
  async updateUser(user, newData, persist) {
    let target = newData;

    if (user.id === this.user.data.id && persist) {
      this.user.data = {
        ...this.user.data,
        ...newData,
      };

      target = this.user.data;
    }

    Object.keys(target).forEach((key) => {
      set(this.lobby.players[user.id], key, target[key]);
    });

    await this.connection.syncPlayers(this.lobby.lobbyId, this.lobby.players);
  }

  @action
  async setTeam(player, team) {
    this.lobby.players = {
      ...this.lobby.players,
      [player.id]: {
        ...player,
        team,
      },
    };

    await this.connection.syncPlayers(this.lobby.lobbyId, this.lobby.players);
  }

  @action
  async toggleLead(player) {
    this.lobby.players = {
      ...this.lobby.players,
      [player.id]: {
        ...player,
        lead: !player.lead,
      },
    };

    await this.connection.syncPlayers(this.lobby.lobbyId, this.lobby.players);
  }

  @action
  async startGame() {
    // TODO Seal game

    this.transitionToRoute('lobby.game');
  }
}

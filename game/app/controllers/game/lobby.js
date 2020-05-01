import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action, set } from '@ember/object';
import { TEAMS } from 'game/utils/enums';

export default class GameLobbyController extends Controller {
  @service intl;
  @service socket;
  @service state;
  @service user;
  @service words;

  @tracked isLoading = false;
  @tracked isEditMode = false;
  @tracked isSelectingWords = false;

  TEAMS = TEAMS;

  get playersList() {
    return Object.values(this.state.players);
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
      !!this.leadTeamB &&
      this.user.isLead &&
      this.state.words !== ''
    );
  }

  get lobbyUrl() {
    return `${window.location.protocol}//${window.location.host}/${this.socket.room}`;
  }

  get canShare() {
    return !!window.navigator.share;
  }

  @action
  async updateUser(user, newData, persist) {
    let target = newData;
    const players = this.state.players;

    if (persist && user.id === this.user.data.id) {
      this.user.data = {
        ...this.user.data,
        ...newData,
      };

      target = this.user.data;
    }

    Object.keys(target).forEach((key) => {
      set(players[user.id], key, target[key]);
    });

    await this.state.syncPlayers(players);
  }

  @action
  async setTeam(player, team) {
    const players = {
      ...this.state.players,
      [player.id]: {
        ...player,
        team,
      },
    };

    await this.state.syncPlayers(players);
  }

  @action
  async toggleLead(player) {
    const players = {
      ...this.state.players,
      [player.id]: {
        ...player,
        lead: !player.lead,
      },
    };

    await this.state.syncPlayers(players);
  }

  @action
  async selectWords(value) {
    this.isSelectingWords = true;

    await this.state.selectWords(value);

    this.isSelectingWords = false;
  }

  @action
  async startGame(event) {
    event.preventDefault();

    this.isLoading = true;

    const words = (
      [...event.target.elements].find((element) => element.type === 'textarea')
        ?.value || ''
    )
      .split(',')
      .map((word) => word.trim());

    await this.state.startGame(words);

    this.transitionToRoute('game.index');
  }

  @action
  async doRandomizePlayers() {
    return this.state.randomizePlayers();
  }

  @action
  async share() {
    if (window.navigator.share) {
      try {
        await window.navigator.share({
          title: this.intl.t('application.title'),
          text: this.intl.t('gameLobby.text.shared'),
          url: this.lobbyUrl,
        });
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }

        console.error(err);
      }
    }
  }
}

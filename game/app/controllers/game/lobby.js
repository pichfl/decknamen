import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { TEAMS } from 'game/utils/enums';

export default class GameLobbyController extends Controller {
  @service intl;
  @service router;
  @service socket;
  @service state;
  @service words;

  @tracked isLoading = false;
  @tracked isEditMode = false;
  @tracked isSelectingWords = false;

  TEAMS = TEAMS;

  get playersTeamA() {
    return this.state.players.filter(
      (player) => player.team === TEAMS.TEAM_A && !player.lead
    );
  }

  get playersTeamB() {
    return this.state.players.filter(
      (player) => player.team === TEAMS.TEAM_B && !player.lead
    );
  }

  get playersWaiting() {
    return this.state.players.filter((player) => player.team === undefined);
  }

  get lobbyUrl() {
    return `${window.location.protocol}//${window.location.host}/${this.socket.room}`;
  }

  get canShare() {
    return !!window.navigator.share;
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

    await this.state.startGame([...new Set(words)]);

    this.router.transitionTo('game.index');
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

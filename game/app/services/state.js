import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { sampleSize, shuffle } from 'lodash-es';
import { CARD_STATES, CARD_TYPES } from '../utils/enums';
import GameState from '../utils/game-state';

const { UNCOVERED } = CARD_STATES;
const { TEAM_A, TEAM_B, BYSTANDER, ABORT } = CARD_TYPES;

export class StateService extends Service {
  @service user;
  @service router;
  @service sound;
  @service socket;

  @tracked current = null;

  @task(function* () {
    const response = yield this.socket.roomSync(this.current.serialize());

    this.current = this.current.merge(response);
  })
  syncTask;

  async connect(room) {
    await this.socket.connect(room);
    const data = await this.socket.roomRead();

    this.current = new GameState(data);
    this.assignPlayer();

    await this.syncTask.perform();

    this.subscribe();
  }

  subscribe() {
    this.socket.subscribe('room.sync', (data) => {
      if (!data) {
        return;
      }

      this.current = this.current.merge(data);

      if (!this.player) {
        this.current = null;
        this.socket.room = undefined;
        this.router.transitionTo('index');

        return;
      }
    });

    this.socket.subscribe('room.sound', ({ sprite }) => {
      this.sound.play(sprite);
    });

    document.addEventListener('visibilitychange', async () => {
      if (document.hidden) {
        return;
      }

      const response = await this.socket.roomRead();

      this.current = this.current.merge(response);
    });
  }

  assignPlayer() {
    // Skip player assignment if the game has started
    if (this.cards.length > 0) {
      return;
    }

    const randomTeam = Math.random() < 0.5 ? TEAM_A : TEAM_B;
    const smallerTeam = this.teamA.length < this.teamB.length ? TEAM_A : TEAM_B;
    const nextTeam =
      this.teamA.length === this.teamB.length ? randomTeam : smallerTeam;
    const team = this.player?.team ?? nextTeam;

    this.current.updatePlayer({
      ...this.user.data,
      team,
    });
  }

  async updatePlayer(player) {
    this.current.updatePlayer(player);

    await this.syncTask.perform();
  }

  async randomizePlayers() {
    const players = [...this.players];
    const shuffledPlayers = shuffle(players);
    const teamSize = Math[Math.random() < 0.5 ? 'floor' : 'ceil'](
      shuffledPlayers.length / 2
    );

    shuffledPlayers.forEach(({ id }, index) => {
      this.current.updatePlayer({
        id,
        team: index < teamSize ? TEAM_A : TEAM_B,
        lead: index === 0 || index === teamSize,
      });
    });

    await this.syncTask.perform();
  }

  async kickPlayer(playerId) {
    this.current.removePlayer(playerId);
    this.syncTask.perform();
  }

  async selectWords(words) {
    this.current.words = words;

    await this.syncTask.perform();
  }

  async startGame(words) {
    const selectedWords = sampleSize(words, 25);

    // Pick starting team
    const firstTeam = Math.random() < 0.5 ? TEAM_A : TEAM_B;
    const secondTeam = firstTeam === TEAM_A ? TEAM_B : TEAM_A;

    // Create cards
    const cards = shuffle(selectedWords).map((word, index) => {
      let type = CARD_TYPES.BYSTANDER;

      if (index < 9) {
        type = firstTeam;
      } else if (index < 17) {
        type = secondTeam;
      } else if (index === 17) {
        type = ABORT;
      }

      return {
        type,
        word,
        state: CARD_STATES.COVERED,
        selected: false,
      };
    });

    this.current.cards.push(...shuffle(cards));
    this.current.turn = firstTeam;

    this.syncTask.perform();
  }

  async changeCard(card) {
    let turn = this.turn;

    this.current.cards = this.cards.map((oldCard) => {
      if (this.turn !== this.user.team) {
        return oldCard;
      }

      if (oldCard.state === UNCOVERED) {
        return oldCard;
      }

      if (oldCard.word !== card.word) {
        return { ...oldCard, selected: false };
      }

      if (!this.player.lead) {
        return { ...oldCard, selected: true };
      }

      if (card.type === ABORT) {
        this.playSound('fail');

        return {
          ...oldCard,
          state: UNCOVERED,
          selected: false,
        };
      }

      if (card.type === BYSTANDER || card.type !== turn) {
        turn = turn === TEAM_A ? TEAM_B : TEAM_A;

        this.playSound('fail');
      } else {
        this.playSound('success');
      }

      return {
        ...oldCard,
        state: UNCOVERED,
        selected: false,
      };
    });

    this.current.turn = turn;

    return this.syncTask.perform();
  }

  async endTurn() {
    const { TEAM_A, TEAM_B } = CARD_TYPES;

    this.current.turn = this.turn === TEAM_A ? TEAM_B : TEAM_A;

    return this.syncTask.perform();
  }

  async reset() {
    this.current.reset();
    await this.syncTask.perform();
  }

  async playSound(sprite) {
    this.sound.play(sprite);

    return this.socket.roomSound(sprite);
  }
}

export default class GameStateService extends StateService {
  get player() {
    return this.current?.getPlayer(this.user.id);
  }

  get players() {
    return this.current?.players ?? [];
  }

  get cards() {
    return this.current?.cards ?? [];
  }

  get words() {
    return this.current?.words ?? '';
  }

  get turn() {
    return this.current?.turn;
  }

  get canStartGame() {
    return (
      this.playersTeamA.length > 0 &&
      this.playersTeamB.length > 0 &&
      !!this.leadTeamA &&
      !!this.leadTeamB &&
      this.player.lead &&
      this.words !== null &&
      this.cards.length === 0
    );
  }

  get over() {
    return (
      this.cards.length > 0 &&
      (this.failed || this.winner !== undefined || false)
    );
  }

  get failed() {
    return this.cards.some(
      (card) => card.type === ABORT && card.state === UNCOVERED
    );
  }

  get statistics() {
    const stats = this.cards.reduce(
      (acc, card) => {
        if (card.type === TEAM_A) {
          acc.teamA.total++;

          if (card.state === UNCOVERED) {
            acc.teamA.uncovered++;
          }
        }

        if (card.type === TEAM_B) {
          acc.teamB.total++;

          if (card.state === UNCOVERED) {
            acc.teamB.uncovered++;
          }
        }

        return acc;
      },
      {
        teamA: { total: 0, uncovered: 0 },
        teamB: { total: 0, uncovered: 0 },
        winner: undefined,
      }
    );

    if (stats.teamA.uncovered === stats.teamA.total) {
      stats.winner = TEAM_A;
    } else if (stats.teamB.uncovered === stats.teamB.total) {
      stats.winner = TEAM_B;
    }

    return stats;
  }

  get winnerTeamA() {
    return this.statistics.winner === TEAM_A;
  }

  get winnerTeamB() {
    return this.statistics.winner === TEAM_B;
  }

  get winner() {
    return this.statistics.winner;
  }

  get teamA() {
    return this.players.filter((player) => player.team === TEAM_A);
  }

  get teamB() {
    return this.players.filter((player) => player.team === TEAM_B);
  }

  get leadTeamA() {
    return this.players.find((player) => player.team === TEAM_A && player.lead);
  }

  get leadTeamB() {
    return this.players.find((player) => player.team === TEAM_B && player.lead);
  }

  get playersTeamA() {
    return this.players.filter(
      (player) => player.team === TEAM_A && !player.lead
    );
  }

  get playersTeamB() {
    return this.players.filter(
      (player) => player.team === TEAM_B && !player.lead
    );
  }
}

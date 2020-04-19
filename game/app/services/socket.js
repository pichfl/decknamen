import Service, { inject as service } from '@ember/service';
import io from 'socket.io-client';
import ENV from 'game/config/environment';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { sampleSize, difference, shuffle } from 'lodash-es';
import { CARD_STATES, CARD_TYPES } from '../utils/enums';

const { COVERED, UNCOVERED } = CARD_STATES;
const { TEAM_A, TEAM_B, BYSTANDER, ABORT } = CARD_TYPES;

export default class SocketService extends Service {
  socket = io(ENV.APP.server, {
    autoConnect: false,
  });

  @service user;
  @service router;

  @tracked isConnected = false;
  @tracked room = undefined;
  @tracked current = {};

  @task(function* (payload = {}) {
    const state = {
      players: {
        ...payload.players,
      },
      words: payload.words || '',
      cards: payload.cards ? payload.cards : this.current?.cards || undefined,
      turn: payload.turn !== undefined ? payload.turn : undefined,
      over: payload.over !== undefined ? payload.over : undefined,
    };

    const { data } = yield this.emit('room.sync', {
      room: this.room,
      data: state,
    });

    this.current = data;

    return data;
  })
  syncTask;

  get players() {
    return JSON.parse(JSON.stringify(this.current?.players || {}));
  }

  get cards() {
    return JSON.parse(JSON.stringify(this.current?.cards || []));
  }

  get words() {
    return `${this.current?.words || ''}`;
  }

  get turn() {
    return this.current.turn;
  }

  get totalCardsTeamA() {
    return this.countTotalCardsByTeam(TEAM_A);
  }

  get totalCardsTeamB() {
    return this.countTotalCardsByTeam(TEAM_B);
  }

  get totalCards() {
    return this.countTotalCardsByTeam(this.turn);
  }

  get uncoveredCards() {
    return this.countUncoveredCardsByTeam(this.turn);
  }

  get winner() {
    if (this.winnerTeamA) {
      return TEAM_A;
    }

    if (this.winnerTeamB) {
      return TEAM_B;
    }

    return undefined;
  }

  get winnerTeamA() {
    return this.uncoveredCardsTeamA === this.totalCardsTeamA;
  }

  get winnerTeamB() {
    return this.uncoveredCardsTeamB === this.totalCardsTeamB;
  }

  get failed() {
    return this.cards.some(
      (card) => card.type === ABORT && card.state === UNCOVERED
    );
  }

  get over() {
    return (
      this.cards.length > 0 &&
      (this.current.over || this.failed || this.winner !== undefined || false)
    );
  }

  get uncoveredCardsTeamA() {
    return this.countUncoveredCardsByTeam(TEAM_A);
  }

  get uncoveredCardsTeamB() {
    return this.countUncoveredCardsByTeam(TEAM_B);
  }

  countUncoveredCardsByTeam(team) {
    return this.cards.reduce(
      (acc, card) =>
        card.type === team && card.state !== CARD_STATES.COVERED ? ++acc : acc,
      0
    );
  }

  countTotalCardsByTeam(team) {
    return this.cards.reduce(
      (acc, card) => (card.type === team ? ++acc : acc),
      0
    );
  }

  async syncPlayers(players) {
    return this.syncTask.perform({
      ...this.current,
      players,
    });
  }

  async connect(room, player) {
    return new Promise((resolve) => {
      this.socket.open();
      this.socket.on('connect', async () => {
        const { id, data } = await this.emit('room.join', {
          room,
          sender: this.user.id,
          player,
        });

        if (id !== room) {
          throw new Error('Out of sync');
        }

        this.room = room;
        this.current = data;

        this.subscribe('room.sync', (data) => {
          this.current = data;
        });

        this.subscribe('room.delete', () => {
          this.current = {};
          this.room = undefined;
          this.router.transitionTo('index');
        });

        this.isConnected = true;

        resolve();
      });
    });
  }

  async selectWords(id) {
    await this.syncTask.perform({
      ...this.current,
      words: id,
    });
  }

  async startGame(words) {
    const selectedWords = sampleSize(words, 25);

    // Create cards
    let cards = selectedWords.map((word) => ({
      type: CARD_TYPES.BYSTANDER,
      word,
      fail: false,
      state: CARD_STATES.COVERED,
      selected: false,
    }));

    // Pick starting team
    const firstTeam = Math.random() < 0.5 ? TEAM_A : TEAM_B;
    const secondTeam = firstTeam === TEAM_A ? TEAM_B : TEAM_A;

    const firstTeamCards = sampleSize(cards, 9);

    cards = difference(cards, firstTeamCards);

    firstTeamCards.forEach((card) => {
      card.type = firstTeam;
    });

    const secondTeamCards = sampleSize(cards, 8);

    cards = difference(cards, secondTeamCards);

    secondTeamCards.forEach((card) => {
      card.type = secondTeam;
    });

    const failCards = sampleSize(cards, 1);

    cards = difference(cards, failCards);

    failCards.forEach((card) => {
      card.type = ABORT;
    });

    cards = shuffle(
      shuffle([...cards, ...failCards, ...firstTeamCards, ...secondTeamCards])
    );

    await this.syncTask.perform({
      cards,
      turn: firstTeam,
    });
  }

  async changeCard(card) {
    let turn = this.turn;

    const cards = this.cards.map((oldCard) => {
      if (this.turn !== this.user.team) {
        return oldCard;
      }

      if (oldCard.state === UNCOVERED) {
        return oldCard;
      }

      if (oldCard.word !== card.word) {
        return { ...oldCard, selected: false };
      }

      if (!this.user.isLead) {
        return { ...oldCard, selected: !oldCard.selected };
      }

      if (card.type === ABORT) {
        return {
          ...oldCard,
          state: UNCOVERED,
          turn: undefined,
          selected: false,
        };
      }

      if (card.type === BYSTANDER || card.type !== turn) {
        turn = turn === TEAM_A ? TEAM_B : TEAM_A;
      }

      return {
        ...oldCard,
        state: oldCard.state === COVERED ? UNCOVERED : COVERED,
        selected: false,
        turn,
      };
    });

    return this.syncTask.perform({
      ...this.current,
      cards,
      turn,
    });
  }

  async endTurn() {
    const { TEAM_A, TEAM_B } = CARD_TYPES;

    await this.syncTask.perform({
      turn: this.turn === TEAM_A ? TEAM_B : TEAM_A,
    });
  }

  async endGame() {
    await this.syncTask.perform({
      over: true,
    });
  }

  async reset() {
    await this.syncTask.perform({
      over: false,
      turn: undefined,
      cards: [],
      words: '',
    });
  }

  async exit() {
    await this.emit('room.delete', { room: this.room });
  }

  async emit(eventName, data) {
    const sender = this.user.id;

    return new Promise((resolve) => {
      this.socket.emit(eventName, { sender, ...data }, (...args) => {
        resolve(...args);
      });
    });
  }

  subscriptions = new Map();

  subscribe(keyword, callback) {
    if (this.subscriptions.has(keyword)) {
      this.subscriptions.get(keyword).add(callback);
    } else {
      this.subscriptions.set(keyword, new Set([callback]));
      this.socket.on(keyword, (...args) => {
        this.subscriptions.get(keyword).forEach((val) => val(...args));
      });
    }
  }

  unsubscribe(keyword, callback) {
    this.subscriptions.get(keyword).delete(callback);
  }
}

import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { sampleSize, difference, shuffle } from 'lodash-es';
import { CARD_STATES, CARD_TYPES } from '../utils/enums';

const { UNCOVERED } = CARD_STATES;
const { TEAM_A, TEAM_B, BYSTANDER, ABORT } = CARD_TYPES;

export default class StateService extends Service {
  @service user;
  @service router;
  @service sound;
  @service socket;

  @tracked current = {};

  @task(function* (payload = {}, force = false) {
    const state = {
      players: {
        ...payload.players,
      },
      words: payload.words || '',
      cards:
        payload.cards !== undefined
          ? payload.cards
          : this.current?.cards || undefined,
      turn: payload.turn !== undefined ? payload.turn : undefined,
    };

    const response = yield this.socket.roomSync({
      data: state,
      force,
    });

    this.current = response.data;

    return response.data;
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
      !!this.socket.room &&
      this.cards.length > 0 &&
      (this.failed || this.winner !== undefined || false)
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

  async connect(room, player) {
    await this.socket.connect();

    const { id, data } = await this.socket.emit('room.join', {
      room,
      sender: this.user.id,
      player,
    });

    if (id !== room) {
      throw new Error('Out of sync');
    }

    this.socket.room = room;
    this.current = data;

    this.socket.subscribe('room.sync', (data) => {
      if (data.players[this.user.id] === undefined) {
        this.current = {};
        this.socket.room = undefined;
        this.router.transitionTo('index');

        return;
      }

      this.current = data;
    });

    this.socket.subscribe('room.delete', () => {
      this.current = {};
      this.socket.room = undefined;
      this.router.transitionTo('index');
    });

    this.socket.subscribe('room.sound', ({ sprite }) => {
      this.sound.play(sprite);
    });
  }

  async syncPlayers(players) {
    return this.syncTask.perform({
      ...this.current,
      players,
    });
  }

  async randomizePlayers() {
    const players = this.players;
    const shuffledPlayers = shuffle(Object.values(players));
    const teamSize = Math[Math.random() < 0.5 ? 'floor' : 'ceil'](
      shuffledPlayers.length / 2
    );

    shuffledPlayers.forEach(({ id }, index) => {
      players[id].team = index < teamSize ? TEAM_A : TEAM_B;
      players[id].lead = index === 0 || index === teamSize;
    });

    this.syncPlayers(players);
  }

  async kickPlayer(playerId) {
    const players = this.players;

    players[playerId] = null;

    return this.syncPlayers(players);
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
        this.playSound('fail');

        return {
          ...oldCard,
          state: UNCOVERED,
          turn: undefined,
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

  async reset() {
    await this.syncTask.perform(
      {
        players: Object.values(this.players).reduce(
          (acc, player) => ({
            ...acc,
            [player.id]: { ...player, lead: false, team: undefined },
          }),
          {}
        ),
      },
      true
    );
  }

  async exit() {
    return this.socket.roomDelete();
  }

  async playSound(sprite) {
    this.sound.play(sprite);
    this.socket.roomSound(sprite);
  }
}

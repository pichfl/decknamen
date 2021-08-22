import _merge from 'lodash-es/merge';
import { tracked } from '@glimmer/tracking';

const mergeIntoNewObject = (...args) => _merge({}, ...args);

export default class GameState {
  @tracked _players = null;
  @tracked cards = [];
  @tracked words = null;
  @tracked turn = null;

  constructor(data) {
    const players = data?.players !== undefined ? [...data.players] : [];
    const cards = data?.cards !== undefined ? [...data.cards] : [];

    this._players = new Map(players);
    this.cards = cards;
    this.turn = data?.turn ?? null;
    this.words = data?.words ?? null;
  }

  get players() {
    return [...this._players.values()];
  }

  get cards() {
    return this._cards;
  }

  getPlayer(id) {
    return this._players.get(id);
  }

  updatePlayer(data) {
    if (!data) {
      return;
    }

    const players = new Map(this._players);

    players.set(
      data.id,
      mergeIntoNewObject(this._players.get(data.id) || {}, data)
    );

    this._players = players;
  }

  removePlayer(id) {
    const players = new Map(this._players);

    players.delete(id);

    this._players = players;
  }

  merge(state) {
    if (!state) {
      return;
    }

    this.turn = state.turn;
    this.words = state.words;
    this.cards = state.cards;

    const players = new Map(this._players);
    players.clear();
    this._players = players;

    state.players?.forEach(([, player]) => {
      this.updatePlayer(player);
    });

    return this;
  }

  serialize() {
    return {
      players: [...this._players.entries()],
      cards: this.cards,
      turn: this.turn,
      words: this.words,
    };
  }

  reset() {
    this.cards = [];
    this.words = null;
    this.turn = null;
  }
}

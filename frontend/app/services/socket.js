import Service, { inject as service } from '@ember/service';
import io from 'socket.io-client';
import ENV from 'game/config/environment';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';

/*

localState = {
    players: {
      idstring: {
        id: 'idstring',
      },
    },
    step: 0,
    cards: [
      {
        type: 0,
        word: 'Foobar',
        fail: false,
        state: 0,
        selected: false,
      },
    ],
  };

  */

export default class SocketService extends Service {
  socket = io(ENV.APP.server.replace('localhost', window.location.hostname), {
    autoConnect: false,
  });

  @service user;

  @tracked isConnected = false;
  @tracked room = undefined;
  @tracked current = {};

  @task(function* (data = {}) {
    const state = {
      players: {
        ...data.players,
      },
      locked: data.locked || false,
      cards: data.cards ? [data.cards] : this.current?.cards || [],
    };

    const response = yield this.emit('room.sync', {
      room: this.room,
      data: state,
    });

    this.current = response;

    return response;
  })
  syncTask;

  get players() {
    return JSON.parse(JSON.stringify(this.current.players || {}));
  }

  async syncPlayers(players) {
    return this.syncTask.perform({
      ...this.current,
      players,
    });
  }

  async connect(id) {
    return new Promise((resolve) => {
      this.socket.open();
      this.socket.on('connect', async () => {
        this.room = await this.emit('room.join', {
          id,
          sender: this.user.id,
        });

        await this.syncTask.perform();

        this.subscribe('room.sync', (data) => {
          this.current = data;
        });

        this.isConnected = true;

        resolve();
      });
    });
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

  subscribe(name, callback) {
    if (this.subscriptions.has(name)) {
      this.subscriptions.get(name).add(callback);
    } else {
      this.subscriptions.set(name, new Set([callback]));
      this.socket.on(name, (...args) => {
        this.subscriptions.get(name).forEach((val) => val(...args));
      });
    }
  }

  unsubscribe(name, callback) {
    this.subscriptions.get(name).remove(callback);
  }
}

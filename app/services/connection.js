import Service, { inject as service } from '@ember/service';
import io from 'socket.io-client';
import ENV from 'game/config/environment';
import { tracked } from '@glimmer/tracking';

export default class ConnectionService extends Service {
  socket = io(ENV.APP.server.replace('localhost', window.location.hostname), {
    autoConnect: false,
  });

  @service user;

  @tracked isConnected = false;
  @tracked rooms = {};

  async connect() {
    return new Promise((resolve) => {
      this.socket.open();
      this.socket.on('connect', () => {
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

  async createRooms(id) {
    this.rooms = await this.emit('rooms.create', {
      id,
      sender: this.user.id,
    });

    return this.rooms;
  }

  async syncPlayers(roomId, data) {
    return this.emit('sync.players', {
      room: `${roomId}.players`,
      data,
    });
  }

  async syncGame(roomId, data) {
    return this.emit('sync.game', {
      room: `${roomId}.game`,
      data,
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

import Service, { inject as service } from '@ember/service';
import io from 'socket.io-client';
import ENV from 'game/config/environment';
import { tracked } from '@glimmer/tracking';

export default class SocketService extends Service {
  io = io(ENV.APP.server, {
    autoConnect: false,
  });

  @service user;
  @service router;
  @service sound;

  @tracked isConnected = false;
  @tracked room = undefined;

  async connect() {
    return new Promise((resolve) => {
      this.io.open();
      this.io.on('connect', async () => {
        this.isConnected = true;

        resolve();
      });
    });
  }

  async emit(eventName, data) {
    const sender = this.user.id;

    return new Promise((resolve) => {
      this.io.emit(eventName, { sender, ...data }, (...args) => {
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
      this.io.on(keyword, (...args) => {
        this.subscriptions.get(keyword).forEach((val) => val(...args));
      });
    }
  }

  unsubscribe(keyword, callback) {
    this.subscriptions.get(keyword).delete(callback);
  }

  // --- Room shortcuts

  roomDelete() {
    return this.emit('room.delete', { room: this.room });
  }

  roomSync(payload) {
    return this.emit('room.sync', {
      ...payload,
      room: this.room,
    });
  }

  roomSound(sprite) {
    return this.emit('room.sound', { room: this.room, sprite });
  }
}

import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { nanoid } from 'nanoid';
import fetch from 'fetch';
import getServer from 'game/utils/get-server';
import { defer } from 'rsvp';

export default class SocketService extends Service {
  @tracked primus = undefined;

  @service user;
  @service router;
  @service sound;

  @tracked isConnected = false;
  @tracked room = undefined;

  async loadPrimus() {
    const script = document.createElement('script');
    script.src = `${getServer()}/primus/primus.js`;

    return new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = reject;

      document.querySelector('script').after(script);
    });
  }

  async connect(room) {
    await this.loadPrimus();

    this.primus = new window.Primus(getServer(), {
      reconnect: {
        max: Infinity,
        min: 500,
        retries: 20,
        factor: 1.1,
      },
    });

    this.primus.on('data', ({ type, id, ...data }) => {
      if (this.requests.has(id)) {
        this.requests.get(id).resolve(data);
      }

      if (this.subscriptions.has(type)) {
        this.subscriptions.get(type).forEach((val) => val(data));
      }
    });

    const response = await this.write('room.join', {
      room,
    });

    this.room = response.room;
    this.isConnected = true;
  }

  requests = new Map();

  async write(type, data) {
    const id = nanoid();

    this.requests.set(id, defer());
    this.primus.write({ type, id, ...data });

    return this.requests.get(id).promise;
  }

  async emit(eventName, data) {
    return this.write(eventName, data);
  }

  subscriptions = new Map();

  subscribe(keyword, callback) {
    if (this.subscriptions.has(keyword)) {
      this.subscriptions.get(keyword).add(callback);
    } else {
      this.subscriptions.set(keyword, new Set([callback]));
    }
  }

  unsubscribe(keyword, callback) {
    this.subscriptions.get(keyword).delete(callback);
  }

  // --- Room shortcuts

  roomSync(payload) {
    return this.write('room.sync', {
      ...payload,
    });
  }

  async roomRead() {
    const response = await fetch(`${getServer()}/rooms/${this.room}`);

    return response.json();
  }

  roomSound(sprite) {
    return this.write('room.sound', { room: this.room, sprite });
  }
}

const ms = require('ms');
const redis = require('./redis');

module.exports = class Store {
  roomId(id) {
    return `room.${id}`;
  }

  async setRoom(id, data) {
    let room = this.getRoom(id);

    data = data || room.data || {};

    await redis.set(this.roomId(id), JSON.stringify(data), 'EX', ms('24h'));
  }

  async removeRoom(id) {
    return redis.del(this.roomId(id));
  }

  async getRoom(id) {
    let roomString = (await redis.get(this.roomId(id))) || '{}';

    return JSON.parse(roomString);
  }
};

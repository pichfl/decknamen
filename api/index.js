const primus = require('./src/primus')();

class Store {
  rooms = new Map();
  timeout = 24 * 60 * 60 * 1000;

  setRoom(id, data) {
    let room = {
      data: {},
      timeout: undefined,
    };

    if (this.rooms.has(id)) {
      room = this.rooms.get(id);

      clearTimeout(room.timeout);
    }

    room.timeout = setTimeout(() => {
      this.removeRoom(id);
    }, this.timeout);
    room.data = data || room.data;

    this.rooms.set(id, room);
  }

  removeRoom(id) {
    const room = this.rooms.get(id);

    clearTimeout(room.timeout);

    room.data = null;

    this.rooms.delete(id);
  }

  getRoom(id) {
    if (!this.rooms.has(id)) {
      return;
    }

    return this.rooms.get(id).data;
  }
}

const store = new Store();

primus.on('connection', async (spark) => {
  let room;

  spark.on('data', ({ type, id, ...data }) => {
    if (type === 'room.join') {
      spark.join(data.room, () => {
        spark.write({
          type,
          id,
          ...data,
        });
      });

      room = data.room;

      return;
    }

    if (!room) {
      return;
    }

    if (type === 'room.sync') {
      if (Object.keys(data).length > 0) {
        store.setRoom(room, data);
      }

      spark.room(room).write({
        type,
        id,
        ...store.getRoom(room),
      });

      return;
    }

    if (type === 'room.read') {
      spark.room(room).write({
        type,
        id,
        ...store.getRoom(room),
      });

      return;
    }

    if (type === 'room.sound') {
      spark
        .room(room)
        .except(spark.id)
        .write({
          type,
          id,
          ...data,
        });

      return;
    }
  });
});

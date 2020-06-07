const Primus = require('primus');
const rooms = require('primus-rooms');

const onData = (spark, type, callback) => {
  return spark.on('data', async (payload) => {
    if (payload.type === type) {
      return callback(payload);
    }
  });
};

module.exports = (server, store, options) => {
  const primus = new Primus(server, {
    iknowhttpsisbetter: true,
    transformer: 'sockjs',
    ...options,
    plugin: {
      rooms,
    },
  });

  primus.on('connection', async (spark) => {
    let room;

    onData(spark, 'room.join', (payload) => {
      spark.join(payload.room, () => {
        spark.write(payload);
      });

      room = payload.room;
    });

    onData(spark, 'room.sync', async ({ type, id, ...data }) => {
      if (!room) {
        return;
      }

      if (Object.keys(data).length > 0) {
        await store.setRoom(room, data);
      }

      const roomData = await store.getRoom(room);

      spark.room(room).write({
        type,
        id,
        ...roomData,
      });
    });

    onData(spark, 'room.sound', (payload) => {
      if (!room) {
        return;
      }

      spark.room(room).except(spark.id).write(payload);
    });
  });
};

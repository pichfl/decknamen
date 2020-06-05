const Primus = require('primus');
const rooms = require('primus-rooms');

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

    spark.on('data', async ({ type, id, ...data }) => {
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
          await store.setRoom(room, data);
        }

        const roomData = await store.getRoom(room);

        spark.room(room).write({
          type,
          id,
          ...roomData,
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
};

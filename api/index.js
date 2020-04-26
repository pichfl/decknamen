const io = require('./src/io.js');
const _ = require('lodash');

io.attach(process.env.PORT || 3000);

let store = {};

function mergeRoom(room = {}, data = {}) {
  // ignore changes to the player list if the game has started
  if (data.words || data.cards) {
    delete data.players;
  }

  const result = _.merge({}, room, data);

  Object.keys(result.players).forEach((id) => {
    if (result.players[id] === null) {
      delete result.players[id];
    }
  });

  if (Array.isArray(data.cards)) {
    result.cards = data.cards;
  }

  return result;
}

io.on('connection', async (socket) => {
  let _room;
  let _sender;

  socket.on('room.join', async ({ room, sender, player }, ack) => {
    _sender = sender;
    _room = room;
    store[room] = store[room] || { players: {} };

    await new Promise((resolve) => socket.join(_room, resolve));

    const { id, name } = player;

    if (store[room].players[id]) {
      store[room].players[id].name = name;
    } else {
      store[room].players[id] = { id, name };
    }

    io.to(_room).emit('room.sync', store[_room]);

    ack({ id: room, data: store[room] });
  });

  socket.on('room.sync', ({ sender, room, data }, ack) => {
    if (!sender || sender !== _sender || !room || room !== _room) {
      return;
    }

    store[room] = mergeRoom(store[room], data);

    io.to(room).emit('room.sync', store[room]);

    ack({ id: room, data: store[room] });
  });

  socket.on('room.delete', ({ sender, room }, ack) => {
    if (!sender || sender !== _sender || !room || room !== _room) {
      return;
    }

    delete store[room];

    io.to(room).emit('room.delete', room);

    ack({ id: room });
  });

  socket.on('room.sound', ({ sender, room, sprite }, ack) => {
    if (!sender || sender !== _sender || !room || room !== _room) {
      return;
    }

    io.to(room).emit('room.sound', { sprite });

    ack({ id: room, sprite });
  });
});

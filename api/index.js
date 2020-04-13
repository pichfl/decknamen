const io = require('./src/io.js');

io.attach(3000);

let store = {};

io.on('connection', async (socket) => {
  let room;
  let _sender;

  socket.on('room.join', async ({ id, sender }, ack) => {
    _sender = sender;
    _room = id;
    store[room] = store[room] || {};

    await new Promise((resolve) => socket.join(_room, resolve));

    ack(_room);
  });

  socket.on('room.sync', ({ sender, room, data }, ack) => {
    if (!sender || !room || room !== _room) {
      return;
    }

    // TODO: Better merge strategy?
    store[room] = { ...store[room], ...data };

    setTimeout(() => {
      io.to(_room).emit('room.sync', store[room]);

      ack(store[room]);
    }, 500);
  });

  socket.on('disconnect', () => {
    if (!_sender || !store[_room] || store[_room].locked) {
      return;
    }

    if (store && store[_room] && store[_room].players) {
      delete store[_room].players[_sender];
    }

    io.to(_room).emit('room.sync', store[_room]);
  });
});

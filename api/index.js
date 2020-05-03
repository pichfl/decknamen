const io = require('./src/io.js');
const _ = require('lodash');

io.attach(process.env.PORT || 3000);

let store = {};

// TODO: Remove room from store after x days;

io.on('connection', async (socket) => {
  let _room;
  let _sender;

  socket.on('room.join', async ({ room, sender }, ack) => {
    _sender = sender;
    _room = room;

    console.log('join', room, sender);

    await new Promise((resolve) => socket.join(_room, resolve));

    ack({ id: room, data: store[room] });
  });

  socket.on('room.sync', ({ sender, room, data }, ack) => {
    console.log('sync', sender, room, data);

    if (!sender || sender !== _sender || !room || room !== _room) {
      return;
    }

    store[room] = data;

    io.to(room).emit('room.sync', store[room]);

    ack({ id: room, data: store[room] });
  });

  socket.on('room.read', ({ sender, room }, ack) => {
    if (!sender || sender !== _sender || !room || room !== _room) {
      return;
    }

    ack({ id: room, data: store[room] });
  });

  socket.on('room.sound', ({ sender, room, sprite }, ack) => {
    if (!sender || sender !== _sender || !room || room !== _room) {
      return;
    }

    io.to(room).emit('room.sound', { sprite });

    ack({ id: room, sprite });
  });
});

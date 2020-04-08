const io = require('./src/io.js');

io.attach(3000);

const joinRoom = async (socket, room) => new Promise((resolve) => socket.join(room, resolve));

let store = {};

io.on('connection', async (socket) => {
  let _roomGame;
  let _roomPlayers;
  let _sender;

  socket.on('rooms.create', async ({ id, sender }, ack) => {
    _roomGame = `${id}.game`;
    _roomPlayers = `${id}.players`;
    _sender = sender;

    await joinRoom(socket, _roomGame);
    await joinRoom(socket, _roomPlayers);

    ack({
      game: _roomGame,
      players: _roomPlayers,
    });
  });

  socket.on('sync.game', ({ sender, room, data }, ack) => {
    if (!sender || !room || room !== _roomGame) {
      return;
    }

    _dataGame = { ..._dataGame, ...data };

    io.to(_roomGame).emit('sync.game', { sender, data: _dataGame });

    ack(_dataGame);
  });

  socket.on('sync.players', ({ sender, room, data }, ack) => {
    if (!sender || !room || room !== _roomPlayers) {
      return;
    }

    store[_roomPlayers] = { ...store[_roomPlayers], ...data };

    io.to(_roomPlayers).emit('sync.players', { sender, data: store[_roomPlayers] });

    ack(store[_roomPlayers]);
  });

  socket.on('disconnect', () => {
    if (!_sender) {
      return;
    }

    const players = { ...store[_roomPlayers] };

    delete players[_sender];

    store[_roomPlayers] = players;

    io.to(_roomPlayers).emit('sync.players', { sender: _sender, data: store[_roomPlayers] });
  });
});

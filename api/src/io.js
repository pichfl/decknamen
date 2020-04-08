const socketio = require('socket.io');

const io = socketio({
  serveClient: false,
  cookie: true,
});

module.exports = io;

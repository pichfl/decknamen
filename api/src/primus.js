const Primus = require('primus');
const rooms = require('primus-rooms');

module.exports = (options) => {
  const primus = Primus.createServer({
    iknowhttpsisbetter: true,
    port: process.env.PORT || 3000,
    transformer: 'websockets',
    ...options,
  });

  primus.plugin('rooms', rooms);

  return primus;
};

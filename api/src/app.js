const fastify = require('./fastify');
const primus = require('./primus');
const Store = require('./store');

module.exports = () => {
  const store = new Store();

  fastify.decorate('store', store);

  fastify.listen(process.env.PORT || 3000, '0.0.0.0', (err, address) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }

    console.log(`Server listening on ${address}`);
  });

  primus(fastify.server, store);
};

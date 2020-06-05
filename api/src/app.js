const fastify = require('./fastify');
const primus = require('./primus');
const Store = require('./store');

module.exports = () => {
  const store = new Store();

  fastify.decorate('store', store);

  fastify.listen(process.env.PORT || 3000, (err, address) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }

    fastify.log.info(`server listening on ${address}`);
  });

  primus(fastify.server, store);
};

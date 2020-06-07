const fastify = require('fastify')({
  logger: false,
});

fastify.register(require('fastify-compress'), { global: true });
fastify.register(require('fastify-cors'), {
  origin: [
    'http://localhost:4200',
    'https://dn.ylk.gd',
    /^https:\/\/decknamen-.*\.now\.sh$/,
    ...(process.env.LOCAL_ORIGIN ? [process.env.LOCAL_ORIGIN] : []),
  ],
});

fastify.get('/', (request, reply) => {
  reply.send('Learn more: https://github.com/pichfl/decknamen');
});

fastify.get('/rooms/:id', async (request, reply) => {
  const room = await fastify.store.getRoom(request.params.id);

  reply.send(room);
});

module.exports = fastify;

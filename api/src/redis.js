const Redis = require('ioredis');

const client = new Redis(
  process.env.REDIS_URL ?? 
  process.env.HEROKU_REDIS_PUCE_TLS_URL ?? 
  process.env.HEROKU_REDIS_PUCE_URL, 
  {
    tls: {
        rejectUnauthorized: false
    }
  }
);

client.on('error', (error) => {
  console.error(error)
})

module.exports = client;

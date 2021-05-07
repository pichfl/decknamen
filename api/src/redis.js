const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL, {
  tls: {
      rejectUnauthorized: false
  }
});

module.exports = redis;

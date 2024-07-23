const Redis = require("ioredis");

// const redis = new Redis(); // localhost:6379 => kalau install ke dalam laptop kalian
const redis = new Redis({
  port: 14531, // Redis port
  host: "redis-GANTIYACUY.redis-cloud.com", // Redis host
  // username: "default", // needs Redis >= 6
  password: "gantipasswordnyacuy",
  // db: 0, // Defaults to 0
});

module.exports = redis;

// redisClient.js
const redis = require('redis');

const redisClient = redis.createClient();

redisClient.on('error', (err) => {
    console.error('Redis error: ', err);
});

// Log a message when Redis is ready
redisClient.on('ready', () => {
    console.log('Redis client connected successfully.');
});

// Connect to Redis
redisClient.connect();

module.exports = redisClient; // Export the client instance

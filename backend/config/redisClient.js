// config/redisClient.js
import { createClient } from 'redis';

const redisClient = createClient({
  legacyMode: true,
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.connect().catch(console.error);

export default redisClient;

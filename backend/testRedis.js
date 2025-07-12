// testRedis.js
import redisClient from './config/redisClient.js';

async function test() {
  await redisClient.set('hello', 'redis!');
  const value = await redisClient.get('hello');
  console.log('Value from Redis:', value);
}

test();

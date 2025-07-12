// middleware/rateLimiter.js
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redisClient from '../config/redisClient.js';

// Login attempts: 5 per 10 minutes
export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { error: "Too many login attempts. Try again later." },
  store: new RedisStore({ sendCommand: (...args) => redisClient.sendCommand(args) })
});

// Upload item: 10 per 15 minutes
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Slow down. Too many uploads." },
  store: new RedisStore({ sendCommand: (...args) => redisClient.sendCommand(args) })
});

// General API calls: 100 per 15 minutes
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests. Please try again later." },
  store: new RedisStore({ sendCommand: (...args) => redisClient.sendCommand(args) })
});

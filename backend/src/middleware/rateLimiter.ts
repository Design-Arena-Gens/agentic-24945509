import rateLimit from 'express-rate-limit';
import { RATE_LIMITS } from '@ai-playground/shared';

export const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: RATE_LIMITS.REQUESTS_PER_MINUTE,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: RATE_LIMITS.CHAT_REQUESTS_PER_MINUTE,
  message: 'Too many chat requests, please slow down.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiKeyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: RATE_LIMITS.API_KEY_VALIDATIONS_PER_HOUR,
  message: 'Too many API key validations, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

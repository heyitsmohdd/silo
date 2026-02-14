import rateLimit from 'express-rate-limit';

/**
 * Rate limiting configuration for different endpoints
 */

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased for dev
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased for dev
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const uploadRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 uploads per hour
  message: 'Too many uploads, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Beta security: Limit question creation to prevent spam
export const questionRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 questions per hour
  message: 'Too many questions, please slow down and try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Beta security: Limit chat messages to prevent spam
export const chatRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 messages per minute
  message: 'Too many messages, please slow down.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Resource protection: Limit channel creation
export const createChannelRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 channels per hour
  message: 'You can only create 5 channels per hour. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});


import type { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import logger from '../utils/logger.js';

// Create rate limiter middleware
export const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.API_RATE_WINDOW?.replace(/\D/g, '') || '900', 10) * 1000, // Convert to milliseconds
  max: parseInt(process.env.API_RATE_LIMIT || '100', 10),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    logger.warn('Rate limit exceeded:', {
      ip: req.ip,
      path: req.path,
    });
    res.status(429).json({
      error: 'TOO_MANY_REQUESTS',
      message: 'Too many requests, please try again later',
    });
  },
  skip: (req: Request) => {
    // Skip rate limiting for health check endpoint
    return req.path === '/health';
  },
}); 
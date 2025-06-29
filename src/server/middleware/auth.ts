import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errorHandler.js';
import logger from '../utils/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-here';

interface JWTPayload {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION || '24h' }
  );
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new AppError(
      'Invalid or expired token',
      'INVALID_TOKEN',
      401,
      error
    );
  }
};

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new AppError('No token provided', 'NO_TOKEN', 401);
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new AppError('Invalid token format', 'INVALID_TOKEN_FORMAT', 401);
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('User not authenticated', 'NOT_AUTHENTICATED', 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 'INSUFFICIENT_PERMISSIONS', 403));
    }
    next();
  };
};

export const refreshToken = (req: Request, res: Response) => {
  const { user } = req;
  if (!user) {
    throw new AppError('User not authenticated', 'NOT_AUTHENTICATED', 401);
  }

  const newToken = generateToken(user.userId, user.role);
  
  logger.info('Token refreshed for user:', {
    userId: user.userId,
    role: user.role,
  });

  res.json({ token: newToken });
}; 
import type { Request, Response } from 'express';
import { handleError, isOperational } from '../utils/errorHandler.js';
import logger from '../utils/logger.js';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response
) => {
  const appError = handleError(error);

  // Log non-operational errors as they might need developer attention
  if (!isOperational(appError)) {
    logger.error('Non-operational error occurred', {
      error: appError,
      stack: appError.stack,
      path: req.path,
      method: req.method,
    });
  }

  // Don't expose error details in production
  const response = {
    error: appError.code,
    message: process.env.NODE_ENV === 'production' && !isOperational(appError)
      ? 'An unexpected error occurred'
      : appError.message,
    ...(process.env.NODE_ENV !== 'production' && { details: appError.details }),
  };

  res.status(appError.statusCode).json(response);
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: `Cannot ${req.method} ${req.path}`,
  });
}; 
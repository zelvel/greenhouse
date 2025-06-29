import logger from './logger';

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class HardwareError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'HARDWARE_ERROR', 500, details);
    this.name = 'HardwareError';
  }
}

export const handleError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    logger.error(error.message, {
      code: error.code,
      statusCode: error.statusCode,
      details: error.details,
    });
    return error;
  }

  const appError = new AppError(
    error instanceof Error ? error.message : 'An unexpected error occurred',
    'INTERNAL_ERROR',
    500,
    error
  );

  logger.error(appError.message, {
    code: appError.code,
    statusCode: appError.statusCode,
    details: appError.details,
  });

  return appError;
};

export const isOperational = (error: unknown): boolean => {
  if (error instanceof AppError) {
    return error.statusCode < 500;
  }
  return false;
}; 
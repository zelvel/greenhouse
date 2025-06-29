import logger from './logger';
export class AppError extends Error {
    constructor(message, code, statusCode = 500, details) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
        this.name = 'AppError';
    }
}
export class ValidationError extends AppError {
    constructor(message, details) {
        super(message, 'VALIDATION_ERROR', 400, details);
        this.name = 'ValidationError';
    }
}
export class NotFoundError extends AppError {
    constructor(message) {
        super(message, 'NOT_FOUND', 404);
        this.name = 'NotFoundError';
    }
}
export class HardwareError extends AppError {
    constructor(message, details) {
        super(message, 'HARDWARE_ERROR', 500, details);
        this.name = 'HardwareError';
    }
}
export const handleError = (error) => {
    if (error instanceof AppError) {
        logger.error(error.message, {
            code: error.code,
            statusCode: error.statusCode,
            details: error.details,
        });
        return error;
    }
    const appError = new AppError(error instanceof Error ? error.message : 'An unexpected error occurred', 'INTERNAL_ERROR', 500, error);
    logger.error(appError.message, {
        code: appError.code,
        statusCode: appError.statusCode,
        details: appError.details,
    });
    return appError;
};
export const isOperational = (error) => {
    if (error instanceof AppError) {
        return error.statusCode < 500;
    }
    return false;
};
//# sourceMappingURL=errorHandler.js.map
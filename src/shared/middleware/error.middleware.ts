// 
// Global Error Handling Middleware


import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger.js';

// 
// Custom Application Error

export class AppError extends Error {
    constructor(
        public statusCode: number,
        public override message: string,
        public isOperational: boolean = true
    ) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

// 
// Zod Validation Error Formatter

const formatZodError = (error: ZodError): string => {
    return error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
};

// 
// Global Error Handler

export const errorHandler = (
    err: Error | AppError | ZodError,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    const meta = {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
    };

    // Zod Validation Error
    if (err instanceof ZodError) {
        logger.warn('Validation failed', { ...meta, details: formatZodError(err) });
        res.status(400).json({
            error: 'Validation failed',
            details: formatZodError(err),
        });
        return;
    }

    // Application Error
    if (err instanceof AppError) {
        logger.warn(`API Error: ${err.message}`, { ...meta, statusCode: err.statusCode });
        res.status(err.statusCode).json({
            error: err.message,
        });
        return;
    }

    // Unknown Error
    logger.error('Unhandled internal server error', err instanceof Error ? err : new Error(String(err)), meta);

    const isDevelopment = process.env['NODE_ENV'] === 'development';

    res.status(500).json({
        error: 'Internal server error',
        ...(isDevelopment && { details: err.message, stack: err.stack }),
    });
};

// 
// 404 Not Found Handler

export const notFoundHandler = (req: Request, res: Response): void => {
    logger.warn('Route not found', { method: req.method, url: req.originalUrl, ip: req.ip });
    res.status(404).json({
        error: 'Route not found',
        path: req.path,
    });
};

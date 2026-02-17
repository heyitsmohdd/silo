// 
// Global Error Handling Middleware


import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

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
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    // Zod Validation Error
    if (err instanceof ZodError) {
        res.status(400).json({
            error: 'Validation failed',
            details: formatZodError(err),
        });
        return;
    }

    // Application Error
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            error: err.message,
        });
        return;
    }

    // Unknown Error
    const isDevelopment = process.env['NODE_ENV'] === 'development';

    res.status(500).json({
        error: 'Internal server error',
        ...(isDevelopment && { details: err.message, stack: err.stack }),
    });
};

// 
// 404 Not Found Handler

export const notFoundHandler = (req: Request, res: Response): void => {
    res.status(404).json({
        error: 'Route not found',
        path: req.path,
    });
};

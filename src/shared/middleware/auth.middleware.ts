/**
 * Authentication Middleware
 * JWT Verification and Batch Context Enforcement
 */

import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types/express.types.js';
import { JWTPayload, Role } from '../types/auth.types.js';
import { parseJWTPayload } from '../schemas/auth.schema.js';

const JWT_SECRET = process.env['JWT_SECRET'];

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
}

/**
 * Verify JWT and attach user to request
 * Early return on invalid token
 */
export const verifyJWT = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Missing or invalid authorization header' });
        return;
    }

    const token = authHeader.substring(7);

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as object;
        const payload = parseJWTPayload(decoded);

        req.user = payload as JWTPayload;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ error: 'Token expired' });
            return;
        }
        res.status(401).json({ error: 'Authentication failed' });
    }
};

/**
 * Enforce Batch Context Isolation
 * Extracts (year, branch) from JWT and injects into req.context
 * CRITICAL: This prevents cross-batch data access
 */
export const requireBatchContext = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    if (!req.user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
    }

    const { year, branch } = req.user;

    if (!year || !branch) {
        res.status(403).json({ error: 'Missing batch context in token' });
        return;
    }

    // Inject batch context into request
    req.context = { year, branch };
    next();
};

/**
 * RBAC Middleware Factory
 * Restricts access based on user role
 */
export const requireRole = (...allowedRoles: Role[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }

        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({ error: 'Insufficient permissions' });
            return;
        }

        next();
    };
};

/**
 * Combined Middleware: Verify + Batch Context
 * Use this for all protected academic routes
 */
export const requireAuth = [verifyJWT, requireBatchContext];

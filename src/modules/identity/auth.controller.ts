/**
 * Authentication Controller
 * Request handlers for auth routes
 */

import { Response } from 'express';
import { AuthenticatedRequest } from '../../shared/types/express.types.js';
import { registerUser, loginUser } from './auth.service.js';
import { parseRegisterUser, parseLoginRequest } from '../../shared/schemas/auth.schema.js';

/**
 * POST /auth/register
 * Register a new user with instant account creation
 */
export const register = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const data = parseRegisterUser(req.body);

    const { user, token } = await registerUser(data);

    res.status(201).json({
        message: 'User registered successfully',
        user,
        token,
    });
};

/**
 * POST /auth/login
 * Login existing user
 */
export const login = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { email, password } = parseLoginRequest(req.body);

    const { user, token } = await loginUser(email, password);

    res.status(200).json({
        message: 'Login successful',
        user,
        token,
    });
};

/**
 * GET /auth/me
 * Get current authenticated user
 */
export const getCurrentUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }

    res.status(200).json({
        user: req.user,
    });
};

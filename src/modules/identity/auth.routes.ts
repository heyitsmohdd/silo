/**
 * Authentication Routes
 */

import { Router } from 'express';
import { register, login, getCurrentUser } from './auth.controller.js';
import { verifyJWT } from '../../shared/middleware/auth.middleware.js';

const router = Router();

/**
 * POST /auth/register
 * Self-registration with Email, Password, Role, Year, Branch
 * Returns JWT token immediately
 */
router.post('/register', async (req, res, next) => {
    try {
        await register(req, res);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /auth/login
 * Login with Email and Password
 * Returns JWT token
 */
router.post('/login', async (req, res, next) => {
    try {
        await login(req, res);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /auth/me
 * Get current authenticated user
 * Requires JWT token
 */
router.get('/me', verifyJWT, async (req, res, next) => {
    try {
        await getCurrentUser(req, res);
    } catch (error) {
        next(error);
    }
});

export default router;

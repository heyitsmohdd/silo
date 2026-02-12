import { Router } from 'express';
import { register, login, getCurrentUser, forgotPassword, verifyResetToken, resetPassword, updateProfile, changePassword, backfillUsernames } from './auth.controller.js';
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
 * POST /auth/me
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

/**
 * POST /auth/forgot-password
 * Request password reset link
 */
router.post('/forgot-password', async (req, res, next) => {
    try {
        await forgotPassword(req, res);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /auth/verify-reset-token
 * Verify password reset token
 */
router.post('/verify-reset-token', async (req, res, next) => {
    try {
        await verifyResetToken(req, res);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /auth/reset-password
 * Reset password with valid token
 */
router.post('/reset-password', async (req, res, next) => {
    try {
        await resetPassword(req, res);
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /auth/profile
 * Update user profile (email, firstName, lastName)
 * Requires JWT token
 */
router.put('/profile', verifyJWT, async (req, res, next) => {
    try {
        await updateProfile(req, res);
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /auth/change-password
 * Change user password
 * Requires JWT token
 */
router.put('/change-password', verifyJWT, async (req, res, next) => {
    try {
        await changePassword(req, res);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /auth/backfill
 * Backfill missing usernames
 */
router.post('/backfill', async (req, res, next) => {
    try {
        await backfillUsernames(req, res);
    } catch (error) {
        next(error);
    }
});

export default router;

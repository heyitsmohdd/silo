// 
// Authentication Controller
// Request handlers for auth routes


import { Response } from 'express';
import { AuthenticatedRequest } from '../../shared/types/express.types.js';
import { registerUser, loginUser, handleForgotPassword, handleVerifyResetToken, handleResetPassword, updateUserProfile, changeUserPassword } from './auth.service.js';
import { parseRegisterUser, parseLoginRequest } from '../../shared/schemas/auth.schema.js';

// 
// POST /auth/register
// Register a new user with instant account creation

export const register = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const data = parseRegisterUser(req.body);

    const { user, token } = await registerUser(data);

    res.status(201).json({
        message: 'User registered successfully',
        user,
        token,
    });
};

// 
// POST /auth/login
// Login existing user

export const login = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { email, password } = parseLoginRequest(req.body);

    const { user, token } = await loginUser(email, password);

    res.status(200).json({
        message: 'Login successful',
        user,
        token,
    });
};

// 
// GET /auth/me
// Get current authenticated user

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }

    res.status(200).json({
        user: req.user,
    });
};

// 
// POST /auth/forgot-password
// Send password reset link to email

export const forgotPassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
        res.status(400).json({ error: 'Email is required' });
        return;
    }

    const result = await handleForgotPassword(email);

    if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
    }

    // In production, send email with reset token
    // For now, just return token (for development)
    res.status(200).json({
        message: 'Password reset link sent to your email',
        // In development, include token for testing
        ...(process.env['NODE_ENV'] === 'development' && {
            resetToken: result.token,
            resetUrl: `${process.env['FRONTEND_URL'] || 'http://localhost:5173'}/reset-password?token=${result.token}`,
        }),
    });
};

// 
// POST /auth/verify-reset-token
// Verify password reset token validity

export const verifyResetToken = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { token } = req.body;

    if (!token || typeof token !== 'string') {
        res.status(400).json({ error: 'Token is required' });
        return;
    }

    const result = await handleVerifyResetToken(token);

    if (!result.valid) {
        res.status(400).json({ error: 'Invalid or expired reset token' });
        return;
    }

    res.status(200).json({
        message: 'Token is valid',
        email: result.email,
    });
};

// 
// POST /auth/reset-password
// Reset password with valid token

export const resetPassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { token, newPassword } = req.body;

    if (!token || typeof token !== 'string') {
        res.status(400).json({ error: 'Token is required' });
        return;
    }

    if (!newPassword || typeof newPassword !== 'string') {
        res.status(400).json({ error: 'New password is required' });
        return;
    }

    if (newPassword.length < 8) {
        res.status(400).json({ error: 'Password must be at least 8 characters' });
        return;
    }

    const result = await handleResetPassword(token, newPassword);

    if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
    }

    res.status(200).json({
        message: 'Password reset successful',
    });
};

// 
// PUT /auth/profile
// Update user profile (email, firstName, lastName, username)

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }

    const { email, firstName, lastName, username } = req.body;

    try {
        const updatedUser = await updateUserProfile(req.user.userId, {
            email,
            firstName,
            lastName,
            username,
        });

        res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser,
        });
    } catch (error: any) {
        if (error.statusCode) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Failed to update profile' });
        }
    }
};

// 
// PUT /auth/change-password
// Change user password

export const changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || typeof currentPassword !== 'string') {
        res.status(400).json({ error: 'Current password is required' });
        return;
    }

    if (!newPassword || typeof newPassword !== 'string') {
        res.status(400).json({ error: 'New password is required' });
        return;
    }

    if (newPassword.length < 8) {
        res.status(400).json({ error: 'New password must be at least 8 characters' });
        return;
    }

    try {
        const result = await changeUserPassword(req.user.userId, currentPassword, newPassword);

        if (!result.success) {
            res.status(400).json({ error: result.error });
            return;
        }

        res.status(200).json({
            message: 'Password changed successfully',
        });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to change password' });
    }
};

// 
// POST /auth/backfill
// Temporary endpoint to backfill missing usernames

export const backfillUsernames = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { uniqueNamesGenerator, adjectives, animals } = await import('unique-names-generator');
        const { prisma } = await import('../../shared/lib/prisma.js');

        // Find users with null username
        const users = await prisma.user.findMany({
            where: { username: null },
        });

        let updatedCount = 0;

        for (const user of users) {
            let username = '';
            let isUnique = false;
            let attempts = 0;

            while (!isUnique && attempts < 5) {
                attempts++;
                username = uniqueNamesGenerator({
                    dictionaries: [adjectives, animals],
                    separator: '-',
                    style: 'capital',
                    length: 2,
                });

                const existing = await prisma.user.findUnique({
                    where: { username },
                });

                if (!existing) {
                    isUnique = true;
                }
            }

            if (isUnique) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { username },
                });
                updatedCount++;
            }
        }

        res.status(200).json({
            message: 'Backfill complete',
            totalFound: users.length,
            updated: updatedCount,
        });
    } catch (error) {
        console.error('Backfill error:', error);
        res.status(500).json({ error: 'Backfill failed' });
    }
};

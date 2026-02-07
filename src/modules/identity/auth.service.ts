/**
 * Authentication Service Layer
 * Business logic for user registration and login
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../shared/lib/prisma.js';
import { Role, JWTPayload, SafeUser } from '../../shared/types/auth.types.js';
import { AppError } from '../../shared/middleware/error.middleware.js';
import { generateResetToken, verifyResetToken } from '../../shared/lib/resetToken.js';

const JWT_SECRET = process.env['JWT_SECRET'];

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

const JWT_EXPIRES_IN = '7d'; // Token valid for 7 days

/**
 * Register a new user
 */
export const registerUser = async (data: {
    email: string;
    password: string;
    year: number;
    branch: string;
    role: Role;
    firstName?: string;
    lastName?: string;
}): Promise<{ user: SafeUser; token: string }> => {
    const { email, password, year, branch, role, firstName, lastName } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new AppError(409, 'User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            year,
            branch: branch.toUpperCase(),
            role,
            firstName: firstName ?? null,
            lastName: lastName ?? null,
        },
    });

    // Generate JWT
    const token = generateToken(user);

    // Return user without password
    const { password: _, ...safeUser } = user;

    return { user: safeUser, token };
};

/**
 * Login existing user
 */
export const loginUser = async (
    email: string,
    password: string
): Promise<{ user: SafeUser; token: string }> => {
    // Find user
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new AppError(401, 'Invalid email or password');
    }

    // Check if user is soft-deleted
    if (user.isDeleted) {
        throw new AppError(403, 'This account has been deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new AppError(401, 'Invalid email or password');
    }

    // Generate JWT
    const token = generateToken(user);

    // Return user without password
    const { password: _, ...safeUser } = user;

    return { user: safeUser, token };
};

/**
 * Generate JWT token
 */
const generateToken = (user: {
    id: string;
    email: string;
    role: Role;
    year: number;
    branch: string;
}): string => {
    const payload: JWTPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        year: user.year,
        branch: user.branch,
    };

    return jwt.sign(payload, JWT_SECRET!, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Handle forgot password request
 */
export const handleForgotPassword = async (email: string): Promise<{
    success: boolean;
    token?: string;
    error?: string;
}> => {
    // Find user by email
    const user = await prisma.user.findUnique({
        where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
        return { success: true };
    }

    // Check if user is soft-deleted
    if (user.isDeleted) {
        return { success: true };
    }

    // Generate reset token
    const { token } = generateResetToken(email);

    // In production, send email with reset token
    // For now, store in database or send via email service
    console.log(`Password reset token for ${email}: ${token}`);

    // TODO: Integrate with email service (Nodemailer/SendGrid)
    // await sendPasswordResetEmail(email, token);

    return { success: true, token };
};

/**
 * Handle verify reset token
 */
export const handleVerifyResetToken = async (token: string): Promise<{
    valid: boolean;
    email?: string;
}> => {
    const result = verifyResetToken(token);

    if (!result.valid || !result.email) {
        return { valid: false };
    }

    return { valid: true, email: result.email };
};

/**
 * Handle reset password
 */
export const handleResetPassword = async (token: string, newPassword: string): Promise<{
    success: boolean;
    error?: string;
}> => {
    const result = verifyResetToken(token);

    if (!result.valid || !result.email) {
        return { success: false, error: 'Invalid or expired reset token' };
    }

    // Find user by email
    const user = await prisma.user.findUnique({
        where: { email: result.email },
    });

    if (!user) {
        return { success: false, error: 'User not found' };
    }

    if (user.isDeleted) {
        return { success: false, error: 'This account has been deactivated' };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
    });

    return { success: true };
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
    userId: string,
    data: {
        email?: string;
        firstName?: string;
        lastName?: string;
    }
): Promise<SafeUser> => {
    // Find user
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new AppError(404, 'User not found');
    }

    if (user.isDeleted) {
        throw new AppError(403, 'This account has been deactivated');
    }

    // If email is being updated, check if it's already taken
    if (data.email && data.email !== user.email) {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new AppError(409, 'Email is already in use');
        }
    }

    // If username is being updated, validate restrictions
    if (data.username && data.username !== (user as any).username) {
        // Check if username is already taken
        const existingUser = await prisma.user.findUnique({
            where: { username: data.username },
        });

        if (existingUser) {
            throw new AppError(409, 'Username is already taken');
        }

        // Check 6-month restriction
        const lastChange = (user as any).lastUsernameChange;
        if (lastChange) {
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

            if (new Date(lastChange) > sixMonthsAgo) {
                const nextChangeDate = new Date(lastChange);
                nextChangeDate.setMonth(nextChangeDate.getMonth() + 6);
                throw new AppError(
                    400,
                    `Username can only be changed once every 6 months. Next change available on ${nextChangeDate.toLocaleDateString()}`
                );
            }
        }
    }

    // Update user
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            email: data.email || user.email,
            firstName: data.firstName !== undefined ? data.firstName : user.firstName,
            lastName: data.lastName !== undefined ? data.lastName : user.lastName,
            ...(data.username && data.username !== (user as any).username && {
                username: data.username,
                lastUsernameChange: new Date(),
            }),
        },
    });

    // Return user without password
    const { password: _, ...safeUser } = updatedUser;
    return safeUser;
};

/**
 * Change user password
 */
export const changeUserPassword = async (
    userId: string,
    currentPassword: string,
    newPassword: string
): Promise<{ success: boolean; error?: string }> => {
    // Find user
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        return { success: false, error: 'User not found' };
    }

    if (user.isDeleted) {
        return { success: false, error: 'This account has been deactivated' };
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
        return { success: false, error: 'Current password is incorrect' };
    }

    // Check if new password is same as current
    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
        return { success: false, error: 'New password must be different from current password' };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    });

    return { success: true };
};


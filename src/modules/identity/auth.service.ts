/**
 * Authentication Service Layer
 * Business logic for user registration and login
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../shared/lib/prisma.js';
import { Role, JWTPayload, SafeUser } from '../../shared/types/auth.types.js';
import { AppError } from '../../shared/middleware/error.middleware.js';

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

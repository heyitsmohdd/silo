import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerUser } from './auth.service';
import { prisma } from '../../shared/lib/prisma';
import { AppError } from '../../shared/middleware/error.middleware';

// Mock dependencies
vi.mock('../../shared/config/site.js', () => ({
    siteConfig: {
        features: {
            enableWaitlist: true,
        },
    },
}));

vi.mock('../../shared/lib/prisma', () => ({
    prisma: {
        user: {
            findUnique: vi.fn(),
            create: vi.fn(),
        },
        allowedEmail: {
            findUnique: vi.fn(),
        }
    },
}));

vi.mock('bcryptjs', () => ({
    default: {
        hash: vi.fn().mockResolvedValue('hashed_password'),
        compare: vi.fn(),
    }
}));

vi.mock('jsonwebtoken', () => ({
    default: {
        sign: vi.fn().mockReturnValue('mock_token'),
    }
}));

vi.mock('unique-names-generator', () => ({
    uniqueNamesGenerator: vi.fn().mockReturnValue('generated-username'),
    adjectives: [],
    animals: [],
}));

describe('AuthService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('registerUser', () => {
        const validUserData = {
            email: 'test@example.com',
            password: 'password123',
            year: 1,
            branch: 'CSE',
            role: 'STUDENT' as const,
            firstName: 'Test',
            lastName: 'User',
        };

        it('should register a new user successfully if email is allowed', async () => {
            // Mock allowed email check
            vi.mocked(prisma.allowedEmail.findUnique).mockResolvedValue({
                id: '1',
                email: 'test@example.com',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            // Mock user existence check (user does not exist)
            vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

            // Mock user creation
            vi.mocked(prisma.user.create).mockResolvedValue({
                id: 'user-123',
                ...validUserData,
                password: 'hashed_password',
                username: 'generated-username',
                isDeleted: false,
                isEmailVerified: false,
                verificationToken: null,
                resetToken: null,
                resetTokenExpiry: null,
                lastUsernameChange: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            } as any);

            const result = await registerUser(validUserData);

            expect(result).toHaveProperty('token', 'mock_token');
            expect(result.user).toHaveProperty('email', validUserData.email);
            expect(result.user).not.toHaveProperty('password');
            expect(prisma.user.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    email: validUserData.email,
                    password: 'hashed_password',
                })
            }));
        });

        it('should throw error if email is not in allowed list', async () => {
            // Mock allowed email check (returns null)
            vi.mocked(prisma.allowedEmail.findUnique).mockResolvedValue(null);

            await expect(registerUser(validUserData)).rejects.toThrow(AppError);
            await expect(registerUser(validUserData)).rejects.toThrow('Access Denied: You are not on the VIP list');
        });

        it('should throw error if user already exists', async () => {
            // Mock allowed email check
            vi.mocked(prisma.allowedEmail.findUnique).mockResolvedValue({
                id: '1',
                email: 'test@example.com',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            // Mock user existence check (user exists)
            vi.mocked(prisma.user.findUnique).mockResolvedValue({
                id: 'existing-user-id',
            } as any);

            await expect(registerUser(validUserData)).rejects.toThrow(AppError);
            await expect(registerUser(validUserData)).rejects.toThrow('User with this email already exists');
        });
    });
});

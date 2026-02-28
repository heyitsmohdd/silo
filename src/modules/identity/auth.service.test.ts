import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerUser, loginUser, updateUserProfile, handleForgotPassword, handleVerifyResetToken, handleResetPassword } from './auth.service';
import { prisma } from '../../shared/lib/prisma';
import { User } from '@prisma/client';
import { Role } from '../../shared/types/auth.types';
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
            update: vi.fn(),
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
import bcrypt from 'bcryptjs';

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

vi.mock('../../shared/lib/resetToken.js', () => ({
    generateResetToken: vi.fn().mockImplementation(() => ({ token: 'mock-reset-token', expiresAt: new Date() })),
    verifyResetToken: vi.fn().mockImplementation(() => ({ valid: true, email: 'test@example.com' })),
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
            role: Role.STUDENT,
            firstName: 'Test',
            lastName: 'User',
        };

        it('should register a new user successfully if email is allowed', async () => {
            // Mock allowed email check
            vi.mocked(prisma.allowedEmail.findUnique).mockResolvedValue({
                id: '1',
                email: 'test@example.com',
                addedBy: null,
                createdAt: new Date(),
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
            } as unknown as User);

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
                addedBy: null,
                createdAt: new Date(),
            });

            // Mock user existence check (user exists)
            vi.mocked(prisma.user.findUnique).mockResolvedValue({
                id: 'existing-user-id',
            } as unknown as User);

            await expect(registerUser(validUserData)).rejects.toThrow(AppError);
            await expect(registerUser(validUserData)).rejects.toThrow('User with this email already exists');
        });
    });

    describe('loginUser', () => {
        const loginData = {
            email: 'test@example.com',
            password: 'password123',
        };

        const mockUser = {
            id: 'user-123',
            email: 'test@example.com',
            password: 'hashed_password',
            year: 1,
            branch: 'CSE',
            role: Role.STUDENT,
            firstName: 'Test',
            lastName: 'User',
            isDeleted: false,
        };

        it('should login successfully with valid credentials', async () => {
            vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as unknown as User);
            vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

            const result = await loginUser(loginData.email, loginData.password);

            expect(result).toHaveProperty('token', 'mock_token');
            expect(result.user).toHaveProperty('email', loginData.email);
            expect(result.user).not.toHaveProperty('password');
            expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, mockUser.password);
        });

        it('should throw error if user does not exist', async () => {
            vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

            await expect(loginUser(loginData.email, loginData.password)).rejects.toThrow(AppError);
            await expect(loginUser(loginData.email, loginData.password)).rejects.toThrow('Account not found. Please Sign Up first.');
        });

        it('should throw error if account is deactivated', async () => {
            vi.mocked(prisma.user.findUnique).mockResolvedValue({ ...mockUser, isDeleted: true } as unknown as User);

            await expect(loginUser(loginData.email, loginData.password)).rejects.toThrow(AppError);
            await expect(loginUser(loginData.email, loginData.password)).rejects.toThrow('This account has been deactivated');
        });

        it('should throw error if password is invalid', async () => {
            vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as unknown as User);
            vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

            await expect(loginUser(loginData.email, 'wrongpassword')).rejects.toThrow(AppError);
            await expect(loginUser(loginData.email, 'wrongpassword')).rejects.toThrow('Invalid email or password');
        });
    });

    describe('updateUserProfile', () => {
        const mockUser = {
            id: 'user-123',
            email: 'test@example.com',
            firstName: 'Old',
            lastName: 'Name',
            username: 'old-username',
            lastUsernameChange: null as Date | null,
            isDeleted: false,
        };

        it('should update profile fields successfully', async () => {
            vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as unknown as User);
            vi.mocked(prisma.user.update).mockResolvedValue({
                ...mockUser,
                firstName: 'New',
                lastName: 'Name',
            } as unknown as User);

            const result = await updateUserProfile('user-123', { firstName: 'New' });

            expect(result).toHaveProperty('firstName', 'New');
            expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({ firstName: 'New' })
            }));
        });

        it('should throw error if new email is already taken', async () => {
            // First findUnique returns current user
            vi.mocked(prisma.user.findUnique)
                .mockResolvedValueOnce(mockUser as unknown as User)
                // Second findUnique returns the colliding user
                .mockResolvedValueOnce({ id: 'other-user', email: 'taken@example.com' } as unknown as User);

            await expect(updateUserProfile('user-123', { email: 'taken@example.com' }))
                .rejects.toThrow('Email is already in use');
        });

        it('should throw error if new username is already taken', async () => {
            vi.mocked(prisma.user.findUnique)
                .mockResolvedValueOnce(mockUser as unknown as User) // auth user check
                // No email check since data.email is undefined
                .mockResolvedValueOnce({ id: 'other-user', username: 'taken-username' } as unknown as User); // username uniqueness check

            await expect(updateUserProfile('user-123', { username: 'taken-username' }))
                .rejects.toThrow('Username is already taken');
        });

        it('should throw error if username was changed within the last 6 months', async () => {
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

            vi.mocked(prisma.user.findUnique)
                .mockResolvedValueOnce({ ...mockUser, lastUsernameChange: threeMonthsAgo } as unknown as User) // auth user
                .mockResolvedValueOnce(null) // username check

            await expect(updateUserProfile('user-123', { username: 'new-username' }))
                .rejects.toThrow(/Username can only be changed once every 6 months/);
        });
    });

    describe('Password Reset Flow', () => {
        const mockUser = {
            id: 'user-123',
            email: 'test@example.com',
            password: 'old_hashed_password',
            isDeleted: false,
        };

        describe('handleForgotPassword', () => {
            it('should return success and token for valid active user', async () => {
                vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as unknown as User);
                const { generateResetToken } = await import('../../shared/lib/resetToken.js');
                vi.mocked(generateResetToken).mockReturnValue({ token: 'mock-reset-token', expiresAt: new Date() });

                const result = await handleForgotPassword(mockUser.email);

                expect(result).toHaveProperty('success', true);
                expect(result).toHaveProperty('token', 'mock-reset-token');
            });

            it('should return success but NO token for non-existent user to prevent enumeration', async () => {
                vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

                const result = await handleForgotPassword('nobody@example.com');

                expect(result).toEqual({ success: true });
                expect(result).not.toHaveProperty('token');
            });

            it('should return success but NO token for deactivated user to prevent enumeration', async () => {
                vi.mocked(prisma.user.findUnique).mockResolvedValue({ ...mockUser, isDeleted: true } as unknown as User);

                const result = await handleForgotPassword(mockUser.email);

                expect(result).toEqual({ success: true });
                expect(result).not.toHaveProperty('token');
            });
        });

        describe('handleResetPassword', () => {
            it('should successfully update password with valid token', async () => {
                const { verifyResetToken } = await import('../../shared/lib/resetToken.js');
                vi.mocked(verifyResetToken).mockReturnValue({ valid: true, email: mockUser.email });
                vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as unknown as User);
                vi.mocked(bcrypt.hash).mockResolvedValue('new_hashed_password' as never);

                const result = await handleResetPassword('valid-token', 'new_password123');

                expect(result).toEqual({ success: true });
                expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({
                    where: { id: mockUser.id },
                    data: { password: 'new_hashed_password' }
                }));
            });

            it('should throw error generic if token is invalid or expired', async () => {
                const { verifyResetToken } = await import('../../shared/lib/resetToken.js');
                vi.mocked(verifyResetToken).mockReturnValue({ valid: false });

                await expect(handleResetPassword('invalid-token', 'new_password123')).rejects.toThrow(AppError);
                await expect(handleResetPassword('invalid-token', 'new_password123')).rejects.toThrow('Invalid or expired reset token');
            });

            it('should throw error if user belonging to token is not found', async () => {
                const { verifyResetToken } = await import('../../shared/lib/resetToken.js');
                vi.mocked(verifyResetToken).mockReturnValue({ valid: true, email: 'ghost@example.com' });
                vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

                await expect(handleResetPassword('valid-token', 'new_password123')).rejects.toThrow(AppError);
                await expect(handleResetPassword('valid-token', 'new_password123')).rejects.toThrow('User not found');
            });

            it('should throw error if user belonging to token is deactivated', async () => {
                const { verifyResetToken } = await import('../../shared/lib/resetToken.js');
                vi.mocked(verifyResetToken).mockReturnValue({ valid: true, email: mockUser.email });
                vi.mocked(prisma.user.findUnique).mockResolvedValue({ ...mockUser, isDeleted: true } as unknown as User);

                await expect(handleResetPassword('valid-token', 'new_password123')).rejects.toThrow(AppError);
                await expect(handleResetPassword('valid-token', 'new_password123')).rejects.toThrow('This account has been deactivated');
            });
        });
    });
});

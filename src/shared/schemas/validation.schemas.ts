import { z } from 'zod';

/**
 * Validation schemas for API requests
 */

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  role: z.enum(['STUDENT', 'PROFESSOR']),
  year: z.number().min(2020).max(2030),
  branch: z.string().min(2).max(10),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const updateProfileSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
});

// Note schemas
export const createNoteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().min(1, 'Content is required').max(10000),
  subject: z.string().min(1, 'Subject is required').max(100),
  fileUrl: z.string().url('Invalid file URL').optional(),
  fileType: z.string().optional(),
});

export const updateNoteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200).optional(),
  content: z.string().min(1, 'Content is required').max(10000).optional(),
});

// Message schemas
export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(5000),
});

// Types
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;

// 
// Authentication Zod Schemas
// Parse, Don't Validate - All incoming data must pass through Zod


import { z } from 'zod';
import { Role } from '../types/auth.types.js';

// 
// Login Request Schema

export const LoginRequestSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

// 
// Batch Context Schema

export const BatchContextSchema = z.object({
    year: z.number().int().min(2020).max(2050),
    branch: z.string().min(2).max(10).toUpperCase(),
});

export type BatchContextInput = z.infer<typeof BatchContextSchema>;

// 
// JWT Payload Schema

export const JWTPayloadSchema = z.object({
    userId: z.string().uuid(),
    email: z.string().email(),
    role: z.nativeEnum(Role),
    year: z.number().int(),
    branch: z.string(),
    iat: z.number().optional(),
    exp: z.number().optional(),
});

export type JWTPayloadInput = z.infer<typeof JWTPayloadSchema>;

// 
// Register User Schema

export const RegisterUserSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    year: z.number().int().min(2020).max(2050),
    branch: z.string().min(2).max(10).toUpperCase(),
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    role: z.nativeEnum(Role).default(Role.STUDENT),
});

export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;

// 
// Helper: Parse and throw on invalid data

export const parseLoginRequest = (data: unknown): LoginRequest => {
    return LoginRequestSchema.parse(data);
};

export const parseBatchContext = (data: unknown): BatchContextInput => {
    return BatchContextSchema.parse(data);
};

export const parseJWTPayload = (data: unknown): JWTPayloadInput => {
    return JWTPayloadSchema.parse(data);
};

export const parseRegisterUser = (data: unknown): RegisterUserInput => {
    return RegisterUserSchema.parse(data);
};

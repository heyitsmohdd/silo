// 
// Authentication Domain Types
// Strict type definitions for JWT, User, and Batch Context


export enum Role {
    SUPER_ADMIN = 'SUPER_ADMIN',
    PROFESSOR = 'PROFESSOR',
    STUDENT = 'STUDENT',
}

// 
// Batch Context - The Core Isolation Boundary
// Every request must have a valid (year, branch) tuple

export interface BatchContext {
    year: number;
    branch: string;
}

// 
// JWT Payload - Single Source of Truth for Authorization
// Contains user identity + batch context + role

export interface JWTPayload {
    userId: string;
    email: string;
    role: Role;
    year: number;
    branch: string;
    username?: string;
    iat?: number;
    exp?: number;
}

// 
// User Entity (from Prisma)

export interface User {
    id: string;
    email: string;
    password: string;
    year: number;
    branch: string;
    role: Role;
    firstName: string | null;
    lastName: string | null;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// 
// Safe User (without password)

export type SafeUser = Omit<User, 'password'>;

// 
// Type Guard: Check if role is SUPER_ADMIN

export const isSuperAdmin = (role: Role): boolean => {
    return role === Role.SUPER_ADMIN;
};

// 
// Type Guard: Check if role is PROFESSOR

export const isProfessor = (role: Role): boolean => {
    return role === Role.PROFESSOR;
};

// 
// Type Guard: Check if role is STUDENT

export const isStudent = (role: Role): boolean => {
    return role === Role.STUDENT;
};

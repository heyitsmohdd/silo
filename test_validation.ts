
import { z } from 'zod';

enum Role {
    SUPER_ADMIN = 'SUPER_ADMIN',
    PROFESSOR = 'PROFESSOR',
    STUDENT = 'STUDENT',
}

const RegisterUserSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    year: z.number().int().min(2020).max(2050),
    branch: z.string().min(2).max(10).toUpperCase(),
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    role: z.nativeEnum(Role).default(Role.STUDENT),
});

const payload = {
    email: "nalawadeprathmesh24@gmail.com",
    password: "password123",
    role: "STUDENT",
    year: 2026,
    branch: "CS"
};

try {
    const parsed = RegisterUserSchema.parse(payload);
    console.log("Validation Success:", parsed);
} catch (e) {
    console.error("Validation Failed:", e);
}

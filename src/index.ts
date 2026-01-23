/**
 * The Academic Vault - Express Server Entry Point
 * Domain-Driven Design with Strict Multi-Tenant Batch Isolation
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { errorHandler, notFoundHandler } from './shared/middleware/error.middleware.js';
import authRoutes from './modules/identity/auth.routes.js';
import academicRoutes from './modules/academic/notes.routes.js';

const app = express();
const PORT = process.env['PORT'] ?? 3000;

// ============================================================================
// MIDDLEWARE
// ============================================================================

// CORS Configuration
const allowedOrigins = process.env['ALLOWED_ORIGINS']?.split(',') ?? ['http://localhost:3000'];
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env['NODE_ENV'] ?? 'development',
    });
});

// ============================================================================
// ROUTES
// ============================================================================

app.use('/auth', authRoutes);
app.use('/academic', academicRoutes);
// app.use('/qna', qnaRoutes);

// ============================================================================
// ERROR HANDLING
// ============================================================================

app.use(notFoundHandler);
app.use(errorHandler);

// ============================================================================
// SERVER START
// ============================================================================

app.listen(PORT, () => {
    console.log(`🚀 Academic Vault API running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env['NODE_ENV'] ?? 'development'}`);
    console.log(`🔒 JWT Secret: ${process.env['JWT_SECRET'] ? 'Configured' : 'MISSING!'}`);
});

export default app;

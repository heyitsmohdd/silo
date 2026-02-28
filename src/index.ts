// 
// The Academic Vault - Express Server Entry Point
// Domain-Driven Design with Strict Multi-Tenant Batch Isolation


import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { errorHandler, notFoundHandler } from './shared/middleware/error.middleware.js';
import { authRateLimit, generalRateLimit } from './shared/middleware/rateLimit.middleware.js';
import { sanitizeBody, sanitizeQuery } from './shared/middleware/sanitize.middleware.js';
import authRoutes from './modules/identity/auth.routes.js';
import notesRoutes from './modules/academic/notes.routes.js';
import questionsRoutes from './modules/academic/questions.routes.js';
import reactionsRoutes from './modules/academic/reactions.routes.js';
import accessRoutes from './modules/access/access.routes.js';
import notificationsRoutes from './modules/notifications/notifications.routes.js';
import pushRoutes from './modules/notifications/push.routes.js';
import channelRoutes from './modules/channels/channel.routes.js';
import dmRoutes from './modules/dm/dm.routes.js';
import { initializeSocketHandlers } from './modules/comm/socket.handlers.js';
import { initializeChannelCleanup } from './modules/channels/channel-cleanup.service.js';
import leaderboardRoutes from './modules/academic/leaderboard.routes.js';
import newsRoutes from './modules/news/news.routes.js';
import { logger } from './shared/utils/logger.js';
import { prisma } from './shared/lib/prisma.js';

const app = express();
app.set('trust proxy', 1);

// Lightweight Health Check (Bypasses middleware & logging)
app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'Alive', time: new Date().toISOString() });
});

const httpServer = createServer(app);
const PORT = process.env['PORT'] ?? 3000;

// ============================================================================
// CORS CONFIGURATION
// ============================================================================

const allowedOrigins = process.env['ALLOWED_ORIGINS']?.split(',') ?? [
    'https://siloedu.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
];

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            if (process.env['NODE_ENV'] === 'production') {
                if (!allowedOrigins.includes(origin) || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
                    const msg = 'The CORS policy for this site strictly prohibits the specified Origin in production environments.';
                    return callback(new Error(msg), false);
                }
            } else {
                if (!allowedOrigins.includes(origin) && !origin.startsWith('http://localhost') && !origin.startsWith('http://127.0.0.1')) {
                    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
                    return callback(new Error(msg), false);
                }
            }
            return callback(null, true);
        },
        credentials: true,
    })
);

// ============================================================================
// SOCKET.IO SETUP
// ============================================================================

const io = new Server(httpServer, {
    cors: {
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);

            if (process.env['NODE_ENV'] === 'production') {
                if (!allowedOrigins.includes(origin) || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
                    return callback(new Error('Not allowed by CORS strictly in production'), false);
                }
            } else {
                if (!allowedOrigins.includes(origin) && !origin.startsWith('http://localhost') && !origin.startsWith('http://127.0.0.1')) {
                    return callback(new Error('Not allowed by CORS'), false);
                }
            }
            return callback(null, true);
        },
        credentials: true,
    },
});

// Initialize socket handlers
initializeSocketHandlers(io);

// Export io for use in notification services
export { io };

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Security Headers
app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Input Sanitization
app.use(sanitizeBody);
app.use(sanitizeQuery);

// Rate Limiting
app.use('/auth/login', authRateLimit);
app.use('/auth/register', authRateLimit);
app.use('/auth/change-password', authRateLimit);
app.use(generalRateLimit);

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


// ============================================================================
// ROUTES
// ============================================================================

app.use('/auth', authRoutes);
app.use('/academic', notesRoutes);
app.use('/academic', questionsRoutes);
app.use('/academic', reactionsRoutes);
app.use('/api/access', accessRoutes);
app.use('/api/notifications/push', pushRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/dm', dmRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/news', newsRoutes);

// ============================================================================
// ERROR HANDLING
// ============================================================================

app.use(notFoundHandler);
app.use(errorHandler);

// ============================================================================
// SERVER START
// ============================================================================

httpServer.listen(PORT, () => {
    logger.info(`🚀 Academic Vault API running on port ${PORT}`);
    logger.info(`📍 Environment: ${process.env['NODE_ENV'] ?? 'development'}`);
    logger.info(`🔒 JWT Secret: ${process.env['JWT_SECRET'] ? 'Configured' : 'MISSING!'}`);
    logger.info(`💬 Socket.io: Enabled with JWT authentication`);

    // Initialize channel cleanup service
    initializeChannelCleanup();
});

const gracefulShutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);

    httpServer.close(async () => {
        logger.info('HTTP server closed.');
        try {
            await prisma.$disconnect();
            logger.info('Prisma disconnected successfully.');
            process.exit(0);
        } catch (error) {
            logger.error('Error during Prisma disconnection', error as Error);
            process.exit(1);
        }
    });

    // Force close after 10 seconds if needed
    setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;



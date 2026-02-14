/**
 * Channel Routes
 * API endpoints for channels
 */

import { Router } from 'express';
import { requireAuth } from '../../shared/middleware/auth.middleware.js';
import { createChannelRateLimit } from '../../shared/middleware/rateLimit.middleware.js';
import {
    listChannels,
    getChannel,
    getMessages,
    createChannelHandler,
    deleteChannelHandler,
} from './channel.controller.js';

const router = Router();

/**
 * All routes require authentication
 */
router.use(requireAuth);

/**
 * GET /api/channels
 * List all public channels
 */
router.get('/', listChannels);

/**
 * POST /api/channels
 * Create a new channel
 */
router.post('/', createChannelRateLimit, createChannelHandler);

/**
 * GET /api/channels/:id
 * Get channel details
 */
router.get('/:id', getChannel);

/**
 * GET /api/channels/:id/messages
 * Get channel message history
 */
router.get('/:id/messages', getMessages);

/**
 * DELETE /api/channels/:id
 * Delete a channel (owner only)
 */
router.delete('/:id', deleteChannelHandler);

export default router;

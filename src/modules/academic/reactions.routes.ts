/**
 * Academic Reactions Routes
 */

import { Router } from 'express';
import { toggleReactionHandler } from './reactions.controller.js';
import { requireAuth } from '../../shared/middleware/auth.middleware.js';

const router = Router();

/**
 * All routes require authentication
 */
router.use(requireAuth);

/**
 * POST /academic/reactions
 * Toggle a reaction
 */
router.post('/reactions', async (req, res, next) => {
    try {
        await toggleReactionHandler(req, res);
    } catch (error) {
        next(error);
    }
});

export default router;

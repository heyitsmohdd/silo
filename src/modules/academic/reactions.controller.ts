/**
 * Academic Reactions Controller
 * Request handlers for reaction routes
 */

import { Response } from 'express';
import { AuthenticatedRequest } from '../../shared/types/express.types.js';
import { toggleReaction } from './reactions.service.js';
import { z } from 'zod';

// Simple validation schema
const reactionSchema = z.object({
    questionId: z.string().uuid(),
    type: z.string().min(1),
});

/**
 * POST /academic/reactions
 * Toggle a reaction on a question
 */
export const toggleReactionHandler = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }

    // Validate body
    const validation = reactionSchema.safeParse(req.body);
    if (!validation.success) {
        res.status(400).json({ error: validation.error.issues });
        return;
    }

    const { questionId, type } = validation.data;

    const result = await toggleReaction(questionId, req.user.userId, type);

    res.status(200).json(result);
};

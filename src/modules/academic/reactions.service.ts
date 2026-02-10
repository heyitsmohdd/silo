/**
 * Academic Reactions Service Layer
 * Business logic for toggling reactions
 */

import { prisma } from '../../shared/lib/prisma.js';
import { AppError } from '../../shared/middleware/error.middleware.js';

/**
 * Toggle a reaction on a question
 * If exists -> remove it
 * If not exists -> create it
 */
export const toggleReaction = async (
    questionId: string,
    userId: string,
    type: string
) => {
    // Check if user already reacted with this type
    const existingReaction = await prisma.reaction.findUnique({
        where: {
            userId_questionId_type: {
                userId,
                questionId,
                type,
            },
        },
    });

    if (existingReaction) {
        // Remove reaction
        await prisma.reaction.delete({
            where: { id: existingReaction.id },
        });
        return { action: 'removed' };
    } else {
        // Add reaction
        await prisma.reaction.create({
            data: {
                userId,
                questionId,
                type,
            },
        });
        return { action: 'added' };
    }
};

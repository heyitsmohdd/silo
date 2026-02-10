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
    // Check if user already reacted
    const existingReaction = await prisma.reaction.findUnique({
        where: {
            userId_questionId: {
                userId,
                questionId,
            },
        },
    });

    if (existingReaction) {
        if (existingReaction.type === type) {
            // Same reaction -> Remove it (Toggle off)
            await prisma.reaction.delete({
                where: { id: existingReaction.id },
            });
            return { action: 'removed' };
        } else {
            // Different reaction -> Switch it
            await prisma.reaction.update({
                where: { id: existingReaction.id },
                data: { type },
            });
            return { action: 'switched' };
        }
    } else {
        // No reaction -> Add it
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

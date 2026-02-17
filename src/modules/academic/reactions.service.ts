// 
// Academic Reactions Service Layer
// Business logic for toggling reactions


import { prisma } from '../../shared/lib/prisma.js';

// 
// Toggle a reaction on a question
// If exists -> remove it
// If not exists -> create it

export const toggleReaction = async (
    questionId: string,
    userId: string,
    type: string
) => {
    // Helper to handle Upvote sync
    const syncUpvote = async (tx: any, userId: string, questionId: string, type: string, targetAuthorId?: string) => {
        const isUpvoteType = ['🔥', '❤️'].includes(type);

        if (isUpvoteType && targetAuthorId) {
            // Create/Ensure Upvote exists
            // We use upsert to be safe, though create is likely fine if we manage delete correctly
            // But since Upvote has unique constraint on [userId, questionId], we can simple create and ignore error or findUnique first.
            // Let's check first to avoid unique constraint error on re-toggle
            const existing = await tx.upvote.findUnique({
                where: { userId_questionId: { userId, questionId } }
            });

            if (!existing) {
                await tx.upvote.create({
                    data: {
                        userId,
                        questionId,
                        targetAuthorId
                    }
                });

                // Also increment question upvote count (redundant with reaction count in UI, but good for data consistency if utilized)
                await tx.question.update({
                    where: { id: questionId },
                    data: { upvotes: { increment: 1 } }
                });
            }
        } else {
            // If it's NOT an upvote type (e.g. switched to Poop), or we are removing reaction
            // We should remove the Upvote record if it exists
            const existing = await tx.upvote.findUnique({
                where: { userId_questionId: { userId, questionId } }
            });

            if (existing) {
                await tx.upvote.delete({
                    where: { id: existing.id }
                });
                // Decrement question upvote count
                await tx.question.update({
                    where: { id: questionId },
                    data: { upvotes: { decrement: 1 } }
                });
            }
        }
    };

    // We need the question author ID for Upvote record
    const question = await prisma.question.findUnique({
        where: { id: questionId },
        select: { authorId: true },
    });

    if (!question) throw new Error('Question not found');

    return await prisma.$transaction(async (tx) => {
        const existingReaction = await tx.reaction.findUnique({
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
                await tx.reaction.delete({
                    where: { id: existingReaction.id },
                });

                // Sync Upvote (Remove)
                await syncUpvote(tx, userId, questionId, 'REMOVE', question.authorId); // 'REMOVE' is not fire/heart, so it deletes

                return { action: 'removed' };
            } else {
                // Different reaction -> Switch it
                await tx.reaction.update({
                    where: { id: existingReaction.id },
                    data: { type },
                });

                // Sync Upvote (Check new type)
                await syncUpvote(tx, userId, questionId, type, question.authorId);

                return { action: 'switched' };
            }
        } else {
            // No reaction -> Add it
            await tx.reaction.create({
                data: {
                    userId,
                    questionId,
                    type,
                },
            });

            // Sync Upvote (Add)
            await syncUpvote(tx, userId, questionId, type, question.authorId);

            // Trigger notification (outside transaction usually, but kept here for existing logic flow or move out)
            // We'll return action and do notification in controller or service wrapper?
            // The original code did it here, but not in transaction.
            // We can do it after.
        }
        return { action: 'added' };
    }).then(async (result) => {
        // Post-transaction notifications
        if (result.action === 'added' && question.authorId !== userId) {
            try {
                const { createNotification } = await import('../notifications/notifications.service.js');
                await createNotification(
                    question.authorId,
                    userId,
                    'MENTION',
                    `reacted ${type} to your post`,
                    questionId
                );
            } catch (error) {
                console.error('Failed to create reaction notification:', error);
            }
        }
        return result;
    });
};

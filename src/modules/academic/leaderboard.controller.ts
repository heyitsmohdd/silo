/**
 * Leaderboard Controller
 * Handles requests for leaderboard data
 */

import { Response } from 'express';
import { AuthenticatedRequest } from '../../shared/types/express.types.js';
import { prisma } from '../../shared/lib/prisma.js';

/**
 * GET /api/leaderboard/weekly
 * Returns top 10 contributors based on upvotes received in the last 7 days
 */
export const getWeeklyLeaderboard = async (
    _req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    // 1. Aggregate Question Net Score (Upvotes - Downvotes)
    const questionKarma = await prisma.question.groupBy({
        by: ['authorId'],
        _sum: {
            upvotes: true,
            downvotes: true
        },
    });

    // 2. Aggregate Answer Net Score (Excluding Replies)
    const answerKarma = await prisma.answer.groupBy({
        by: ['authorId'],
        where: {
            parentId: null, // Only count top-level answers
        },
        _sum: {
            upvotes: true,
            downvotes: true
        },
    });

    // 3. Merge and Calculate Net Karma
    const karmaMap = new Map<string, number>();

    questionKarma.forEach(q => {
        const current = karmaMap.get(q.authorId) || 0;
        const net = (q._sum.upvotes || 0) - (q._sum.downvotes || 0);
        karmaMap.set(q.authorId, current + net);
    });

    answerKarma.forEach(a => {
        const current = karmaMap.get(a.authorId) || 0;
        const net = (a._sum.upvotes || 0) - (a._sum.downvotes || 0);
        karmaMap.set(a.authorId, current + net);
    });

    // 4. Sort and Top 10
    const sortedLeaderboard = Array.from(karmaMap.entries())
        .sort((a, b) => b[1] - a[1]) // Descending net score
        .slice(0, 10); // Top 10

    // 5. Fetch User Details
    const leaderboardData = await Promise.all(
        sortedLeaderboard.map(async ([userId, score]) => {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                },
            });

            return {
                id: user?.id,
                username: user?.username || 'Anonymous',
                firstName: user?.firstName,
                lastName: user?.lastName,
                weeklyKarma: score,
            };
        })
    );

    // Filter out nulls
    const validLeaderboard = leaderboardData.filter((entry: any) => entry.id);

    res.status(200).json({ leaderboard: validLeaderboard });
};

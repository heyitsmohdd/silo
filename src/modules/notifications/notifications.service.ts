import { prisma } from '../../shared/lib/prisma.js';

/**
 * Create a new notification
 * Includes duplicate prevention for UPVOTE notifications
 */
export const createNotification = async (
    userId: string, // recipient
    actorId: string, // sender
    type: 'REPLY' | 'UPVOTE' | 'MENTION',
    message: string,
    resourceId?: string
) => {
    // Don't notify self
    if (userId === actorId) return;

    // Duplicate prevention for UPVOTE notifications
    if (type === 'UPVOTE' && resourceId) {
        const existing = await prisma.notification.findFirst({
            where: {
                userId,
                actorId,
                type: 'UPVOTE',
                resourceId,
            },
        });

        if (existing) return; // Already notified about this upvote
    }

    return prisma.notification.create({
        data: {
            userId,
            actorId,
            type,
            message,
            resourceId,
        },
    });
};

/**
 * Get user's notifications
 */
export const getUserNotifications = async (userId: string, limit = 20) => {
    const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
            actor: {
                select: {
                    id: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                },
            },
        },
    });

    const unreadCount = await prisma.notification.count({
        where: {
            userId,
            isRead: false,
        },
    });

    return { notifications, unreadCount };
};

/**
 * Mark all notifications as read for a user
 */
export const markNotificationsRead = async (userId: string) => {
    return prisma.notification.updateMany({
        where: {
            userId,
            isRead: false,
        },
        data: {
            isRead: true,
        },
    });
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async (userId: string) => {
    return prisma.notification.count({
        where: {
            userId,
            isRead: false,
        },
    });
};

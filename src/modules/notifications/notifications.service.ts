import { prisma } from '../../shared/lib/prisma.js';

// 
// Create a new notification
// Includes duplicate prevention for UPVOTE notifications
// Emits real-time Socket.IO event to the recipient

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

    const notification = await prisma.notification.create({
        data: {
            userId,
            actorId,
            type,
            message,
            resourceId,
        },
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

    // Emit real-time notification via Socket.IO
    try {
        const { io } = await import('../../index.js');
        const { emitNotificationToUser } = await import('../comm/socket.handlers.js');

        emitNotificationToUser(io, userId, {
            id: notification.id,
            type: notification.type,
            message: notification.message,
            resourceId: notification.resourceId,
            isRead: notification.isRead,
            createdAt: notification.createdAt,
            actor: notification.actor,
        });
    } catch (error) {
        console.error('Failed to emit notification via socket:', error);
        // Don't throw - notification is still saved in DB
    }

    return notification;
};

// 
// Get user's notifications

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

// 
// Mark all notifications as read for a user

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

// 
// Get unread notification count

export const getUnreadCount = async (userId: string) => {
    return prisma.notification.count({
        where: {
            userId,
            isRead: false,
        },
    });
};

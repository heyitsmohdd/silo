import { prisma } from '../../shared/lib/prisma.js';
import { NotificationType } from '@prisma/client';
import webpush from 'web-push';

const mailto = process.env['EMAIL_USER'] || 'test@test.com';

const vapidPublicKey = process.env['VAPID_PUBLIC_KEY'];
const vapidPrivateKey = process.env['VAPID_PRIVATE_KEY'];

if (vapidPublicKey && vapidPrivateKey) {
    webpush.setVapidDetails(
        `mailto:${mailto}`,
        vapidPublicKey,
        vapidPrivateKey
    );
} else {
    console.warn('⚠️ VAPID keys not configured. Web Push notifications will be disabled.');
}

// 
// Create a new notification
// Includes duplicate prevention for UPVOTE notifications
// Emits real-time Socket.IO event to the recipient

export const createNotification = async (
    userId: string, // recipient
    actorId: string, // sender
    type: 'REPLY' | 'UPVOTE' | 'MENTION' | 'DIRECT_MESSAGE',
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
            }
        });

        if (existing) return;
    }

    const notification = await prisma.notification.create({
        data: {
            userId,
            actorId,
            type: type as NotificationType,
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
                }
            }
        }
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

    // Trigger Web Push Notification
    try {
        const subscriptions = await prisma.pushSubscription.findMany({
            where: { userId }
        });

        const payload = JSON.stringify({
            title: 'Silo',
            message: message,
            url: resourceId ? `/qna/${resourceId}` : '/'
        });

        // Send push to all registered devices of the user
        const pushPromises = subscriptions.map((sub: any) =>
            webpush.sendNotification({
                endpoint: sub.endpoint,
                keys: {
                    auth: sub.auth,
                    p256dh: sub.p256dh
                }
            }, payload).catch(e => {
                if (e.statusCode === 410 || e.statusCode === 404) {
                    // Subscription has expired or is no longer valid
                    return prisma.pushSubscription.delete({ where: { id: sub.id } });
                }
                console.error('Error sending push notification:', e);
                return undefined;
            })
        );

        await Promise.allSettled(pushPromises);
    } catch (error) {
        console.error('Failed to process web push notifications:', error);
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

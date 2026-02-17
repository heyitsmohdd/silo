import { Response } from 'express';
import { AuthenticatedRequest } from '../../shared/types/express.types.js';
import { getUserNotifications, markNotificationsRead } from './notifications.service.js';

// 
// GET /api/notifications
// List user's notifications

export const listNotifications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }

    const { notifications, unreadCount } = await getUserNotifications(req.user.userId);

    res.status(200).json({
        notifications,
        unreadCount,
    });
};

// 
// POST /api/notifications/mark-read
// Mark all notifications as read

export const markRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }

    await markNotificationsRead(req.user.userId);

    res.status(200).json({
        message: 'Notifications marked as read',
    });
};

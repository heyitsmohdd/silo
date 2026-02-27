import { Response } from 'express';
import { AuthenticatedRequest } from '../../shared/types/express.types.js';
import { prisma } from '../../shared/lib/prisma.js';
import { z } from 'zod';

const subscriptionSchema = z.object({
    endpoint: z.string().url(),
    keys: z.object({
        p256dh: z.string(),
        auth: z.string()
    })
});

export const subscribe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }

        const data = subscriptionSchema.parse(req.body);

        // Upsert the subscription (endpoint is unique)
        await prisma.pushSubscription.upsert({
            where: { endpoint: data.endpoint },
            update: {
                userId: req.user.userId,
                p256dh: data.keys.p256dh,
                auth: data.keys.auth,
            },
            create: {
                userId: req.user.userId,
                endpoint: data.endpoint,
                p256dh: data.keys.p256dh,
                auth: data.keys.auth,
            }
        });

        res.status(201).json({ message: 'Push subscription saved successfully' });
    } catch (error) {
        console.error('Failed to save push subscription:', error);
        res.status(400).json({ error: 'Invalid subscription data' });
    }
};

export const unsubscribe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }

        const { endpoint } = req.body;

        if (!endpoint || typeof endpoint !== 'string') {
            res.status(400).json({ error: 'Endpoint is required' });
            return;
        }

        await prisma.pushSubscription.deleteMany({
            where: {
                endpoint: endpoint,
                userId: req.user.userId,
            }
        });

        res.status(200).json({ message: 'Unsubscribed successfully' });
    } catch (error) {
        console.error('Failed to delete push subscription:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

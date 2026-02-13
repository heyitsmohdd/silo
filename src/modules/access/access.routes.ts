
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../shared/lib/prisma.js';

const router = Router();

/**
 * POST /access/request
 * Submit an email for access approval (Waitlist)
 */
router.post('/request', async (req, res, next) => {
    try {
        // 1. Validate email
        const schema = z.object({
            email: z.string().email('Invalid email address'),
        });

        const result = schema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ error: result.error.errors[0]?.message });
            return;
        }

        const { email } = result.data;

        // 2. Check AllowedEmail (Already Approved)
        const isAllowed = await prisma.allowedEmail.findUnique({
            where: { email },
        });

        if (isAllowed) {
            res.status(400).json({ message: 'You are already approved! Please Create an Account.' });
            return;
        }

        // 3. Check AccessRequest (Already Requested)
        const existingRequest = await prisma.accessRequest.findUnique({
            where: { email },
        });

        if (existingRequest) {
            res.status(200).json({ message: 'You are already on the list.' });
            return;
        }

        // 4. Create new AccessRequest
        await prisma.accessRequest.create({
            data: { email },
        });

        res.status(201).json({ message: 'Request received! We will review your application shortly.' });

    } catch (error) {
        next(error);
    }
});

export default router;

import { Router } from 'express';
import { requireAuth } from '../../shared/middleware/auth.middleware.js';
import { subscribe, unsubscribe } from './push.controller.js';

const router = Router();

// Apply auth middleware to all push routes
router.use(requireAuth);

router.post('/subscribe', subscribe);
router.delete('/unsubscribe', unsubscribe);

export default router;

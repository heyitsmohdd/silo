import { Router } from 'express';
import { verifyJWT } from '../../shared/middleware/auth.middleware.js';
import { listNotifications, markRead } from './notifications.controller.js';

const router = Router();

router.get('/', verifyJWT, listNotifications);
router.post('/mark-read', verifyJWT, markRead);

export default router;

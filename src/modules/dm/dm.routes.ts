import { Router } from 'express';
import { requireAuth } from '../../shared/middleware/auth.middleware.js';
import {
    getConversations,
    getConversationById,
    getMessages,
    blockUser,
    unblockUser,
    checkBlockStatus,
    initiateConversation
} from './dm.controller.js';

const router = Router();

// Require authentication for all DM routes
router.use(requireAuth);

router.get('/conversations', getConversations);
router.get('/conversations/:conversationId', getConversationById);
router.post('/conversations/initiate', initiateConversation);
router.get('/messages/:conversationId', getMessages);
router.post('/block', blockUser);
router.post('/unblock', unblockUser);
router.get('/block/status/:targetUserId', checkBlockStatus);

export default router;

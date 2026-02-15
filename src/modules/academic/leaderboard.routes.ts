/**
 * Leaderboard Routes
 * Routes for fetching leaderboard data
 */

import { Router } from 'express';
import { getWeeklyLeaderboard } from './leaderboard.controller.js';
import { requireAuth } from '../../shared/middleware/auth.middleware.js';

const router = Router();

// Publicly accessible, but authenticated for now to match app structure
router.get('/weekly', requireAuth, getWeeklyLeaderboard);

export default router;

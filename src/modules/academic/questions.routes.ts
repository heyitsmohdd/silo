/**
 * Academic Questions/Q&A Routes
 */

import { Router } from 'express';
import {
    listQuestions,
    createQuestionHandler,
    getQuestionHandler,
    updateQuestionHandler,
    deleteQuestionHandler,
    createAnswerHandler,
    deleteAnswerHandler,
    voteQuestionHandler,
    voteAnswerHandler,
    markBestAnswerHandler,
} from './questions.controller.js';
import { requireAuth } from '../../shared/middleware/auth.middleware.js';
import { questionRateLimit } from '../../shared/middleware/rateLimit.middleware.js';

const router = Router();

/**
 * All routes require authentication and batch context
 */
router.use(requireAuth);

/**
 * GET /academic/questions
 * List all questions (batch-scoped)
 * Query params: ?tags=algorithms&search=binary&sortBy=upvotes&limit=20&offset=0
 */
router.get('/questions', async (req, res, next) => {
    try {
        await listQuestions(req, res);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /academic/questions
 * Create a new question
 * Rate limited: 5 questions per hour
 */
router.post('/questions', questionRateLimit, async (req, res, next) => {
    try {
        await createQuestionHandler(req, res);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /academic/questions/:id
 * Get single question by ID with all answers (batch-scoped)
 */
router.get('/questions/:id', async (req, res, next) => {
    try {
        await getQuestionHandler(req, res);
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /academic/questions/:id
 * Update a question (author-only)
 */
router.put('/questions/:id', async (req, res, next) => {
    try {
        await updateQuestionHandler(req, res);
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /academic/questions/:id
 * Soft delete a question (author-only)
 */
router.delete('/questions/:id', async (req, res, next) => {
    try {
        await deleteQuestionHandler(req, res);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /academic/questions/:id/answers
 * Create an answer to a question
 */
router.post('/questions/:id/answers', async (req, res, next) => {
    try {
        await createAnswerHandler(req, res);
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /academic/questions/:id/answers/:answerId
 * Delete an answer (author-only)
 */
router.delete('/questions/:id/answers/:answerId', async (req, res, next) => {
    try {
        await deleteAnswerHandler(req, res);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /academic/questions/:id/vote
 * Vote on a question (upvote or downvote)
 */
router.post('/questions/:id/vote', async (req, res, next) => {
    try {
        await voteQuestionHandler(req, res);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /academic/questions/:id/answers/:answerId/vote
 * Vote on an answer (upvote or downvote)
 */
router.post('/questions/:id/answers/:answerId/vote', async (req, res, next) => {
    try {
        await voteAnswerHandler(req, res);
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /academic/questions/:id/best-answer
 * Mark an answer as the best answer (question author only)
 */
router.put('/questions/:id/best-answer', async (req, res, next) => {
    try {
        await markBestAnswerHandler(req, res);
    } catch (error) {
        next(error);
    }
});

export default router;

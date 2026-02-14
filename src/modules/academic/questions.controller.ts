/**
 * Academic Questions Controller
 * Request handlers for Q&A routes
 */

import { Response } from 'express';
import { AuthenticatedRequest } from '../../shared/types/express.types.js';
import {
    createQuestion,
    getQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
    createAnswer,
    deleteAnswer,
    voteQuestion,
    voteAnswer,
    markBestAnswer,
} from './questions.service.js';
import {
    parseCreateQuestion,
    parseUpdateQuestion,
    parseCreateAnswer,
    parseVote,
    parseQuestionQuery,
    parseBestAnswer,
} from '../../shared/schemas/academic.schema.js';

/**
 * GET /academic/questions
 * List all questions (batch-scoped with filters)
 */
export const listQuestions = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    if (!req.context) {
        res.status(403).json({ error: 'Batch context required' });
        return;
    }

    const { year, branch } = req.context;

    // Parse query parameters
    const filters = parseQuestionQuery({
        tags: req.query['tags'],
        search: req.query['search'],
        sortBy: req.query['sortBy'],
        limit: req.query['limit'] ? parseInt(req.query['limit'] as string) : 20,
        offset: req.query['offset'] ? parseInt(req.query['offset'] as string) : 0,
    });

    const { questions, total } = await getQuestions(year, branch, filters);

    res.status(200).json({
        questions,
        total,
        limit: filters.limit,
        offset: filters.offset,
    });
};

/**
 * POST /academic/questions
 * Create a new question
 */
export const createQuestionHandler = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    if (!req.user || !req.context) {
        res.status(403).json({ error: 'Authentication required' });
        return;
    }

    const data = parseCreateQuestion(req.body);
    const { year, branch } = req.context;

    // Convert comma-separated tags string to array
    const tagsArray = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    const question = await createQuestion(
        {
            title: data.title,
            content: data.content,
            tags: tagsArray,
            authorId: req.user.userId,
        },
        year,
        branch
    );

    res.status(201).json({
        message: 'Question created successfully',
        question,
    });
};

/**
 * GET /academic/questions/:id
 * Get single question by ID with all answers
 */
export const getQuestionHandler = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    if (!req.context) {
        res.status(403).json({ error: 'Batch context required' });
        return;
    }

    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: 'Question ID is required' });
        return;
    }

    const { year, branch } = req.context;

    const question = await getQuestionById(id, year, branch);

    res.status(200).json({ question });
};

/**
 * PUT /academic/questions/:id
 * Update a question (author-only)
 */
export const updateQuestionHandler = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    if (!req.user || !req.context) {
        res.status(403).json({ error: 'Authentication required' });
        return;
    }

    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: 'Question ID is required' });
        return;
    }

    const data = parseUpdateQuestion(req.body);
    const { year, branch } = req.context;

    // Convert tags if provided
    const tagsArray = data.tags
        ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : undefined;

    const question = await updateQuestion(id, req.user.userId, year, branch, {
        title: data.title,
        content: data.content,
        tags: tagsArray,
    });

    res.status(200).json({
        message: 'Question updated successfully',
        question,
    });
};

/**
 * DELETE /academic/questions/:id
 * Soft delete a question (author-only)
 */
export const deleteQuestionHandler = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    if (!req.user || !req.context) {
        res.status(403).json({ error: 'Authentication required' });
        return;
    }

    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: 'Question ID is required' });
        return;
    }

    const { year, branch } = req.context;

    const result = await deleteQuestion(id, req.user.userId, year, branch);

    res.status(200).json(result);
};

/**
 * POST /academic/questions/:id/answers
 * Create an answer to a question
 */
export const createAnswerHandler = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    if (!req.user || !req.context) {
        res.status(403).json({ error: 'Authentication required' });
        return;
    }

    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: 'Question ID is required' });
        return;
    }

    const data = parseCreateAnswer(req.body);
    const { year, branch } = req.context;

    const answer = await createAnswer(
        id,
        {
            content: data.content,
            authorId: req.user.userId,
            parentId: data.parentId,
        },
        year,
        branch
    );

    res.status(201).json({
        message: 'Answer created successfully',
        answer,
    });
};

/**
 * DELETE /academic/questions/:id/answers/:answerId
 * Delete an answer (author-only)
 */
export const deleteAnswerHandler = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    if (!req.user || !req.context) {
        res.status(403).json({ error: 'Authentication required' });
        return;
    }

    const { id, answerId } = req.params;
    if (!id || !answerId) {
        res.status(400).json({ error: 'Question ID and Answer ID are required' });
        return;
    }

    const { year, branch } = req.context;

    const result = await deleteAnswer(id, answerId, req.user.userId, year, branch);

    res.status(200).json(result);
};

/**
 * POST /academic/questions/:id/vote
 * Vote on a question
 */
export const voteQuestionHandler = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    if (!req.context) {
        res.status(403).json({ error: 'Batch context required' });
        return;
    }

    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: 'Question ID is required' });
        return;
    }

    const { voteType } = parseVote(req.body);
    const { year, branch } = req.context;
    const voterId = req.user!.userId;

    const question = await voteQuestion(id, voteType, voterId, year, branch);

    res.status(200).json({
        message: 'Vote recorded successfully',
        question,
    });
};

/**
 * POST /academic/questions/:id/answers/:answerId/vote
 * Vote on an answer
 */
export const voteAnswerHandler = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    if (!req.context) {
        res.status(403).json({ error: 'Batch context required' });
        return;
    }

    const { answerId } = req.params;
    if (!answerId) {
        res.status(400).json({ error: 'Answer ID is required' });
        return;
    }

    const { voteType } = parseVote(req.body);
    const { year, branch } = req.context;
    const voterId = req.user!.userId;

    const answer = await voteAnswer(answerId, voteType, voterId, year, branch);

    res.status(200).json({
        message: 'Vote recorded successfully',
        answer,
    });
};

/**
 * PUT /academic/questions/:id/best-answer
 * Mark an answer as the best answer (question author only)
 */
export const markBestAnswerHandler = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    if (!req.user || !req.context) {
        res.status(403).json({ error: 'Authentication required' });
        return;
    }

    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: 'Question ID is required' });
        return;
    }

    const { answerId } = parseBestAnswer(req.body);
    const { year, branch } = req.context;

    const question = await markBestAnswer(id, answerId, req.user.userId, year, branch);

    res.status(200).json({
        message: 'Best answer marked successfully',
        question,
    });
};

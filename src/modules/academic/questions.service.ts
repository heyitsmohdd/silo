/**
 * Academic Questions Service Layer
 * Business logic for Q&A CRUD with strict batch isolation
 */

import { prisma } from '../../shared/lib/prisma.js';
import { AppError } from '../../shared/middleware/error.middleware.js';
import { Prisma } from '@prisma/client';

/**
 * Create a new question (batch-scoped)
 */
export const createQuestion = async (
    data: {
        title: string;
        content: string;
        tags: string[];
        authorId: string;
    },
    year: number,
    branch: string
) => {
    const question = await prisma.question.create({
        data: {
            title: data.title,
            content: data.content,
            tags: data.tags,
            authorId: data.authorId,
            year: year,
            branch: branch,
        },
        include: {
            author: {
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    username: true,
                    role: true,
                },
            },
            answers: {
                where: { isDeleted: false },
                include: {
                    author: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            username: true,
                        },
                    },
                },
            },
            bestAnswer: true,
        },
    });

    return question;
};

/**
 * Get all questions (batch-scoped with filters)
 */
export const getQuestions = async (
    year: number,
    branch: string,
    filters?: {
        tags?: string;
        search?: string;
        sortBy?: 'newest' | 'oldest' | 'upvotes';
        limit?: number;
        offset?: number;
    }
) => {
    const where: Prisma.QuestionWhereInput = {
        year,
        branch,
        isDeleted: false,
    };

    // Optional tag filter
    if (filters?.tags) {
        where.tags = {
            has: filters.tags,
        };
    }

    // Optional search filter (searches in title and content)
    if (filters?.search) {
        where.OR = [
            { title: { contains: filters.search, mode: 'insensitive' } },
            { content: { contains: filters.search, mode: 'insensitive' } },
        ];
    }

    // Determine sort order
    let orderBy: Prisma.QuestionOrderByWithRelationInput = { createdAt: 'desc' };
    if (filters?.sortBy === 'oldest') {
        orderBy = { createdAt: 'asc' };
    } else if (filters?.sortBy === 'upvotes') {
        orderBy = { upvotes: 'desc' };
    }

    const questions = await prisma.question.findMany({
        where,
        include: {
            author: {
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    username: true,
                    role: true,
                },
            },
            answers: {
                where: { isDeleted: false },
                include: {
                    author: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            username: true,
                        },
                    },
                },
            },
            bestAnswer: true,
            reactions: true, // Include reactions
        },
        orderBy,
        take: filters?.limit ?? 20,
        skip: filters?.offset ?? 0,
    });

    const total = await prisma.question.count({ where });

    return { questions, total };
};

/**
 * Get single question by ID (batch-scoped) with all answers
 */
export const getQuestionById = async (
    id: string,
    year: number,
    branch: string
) => {
    const question = await prisma.question.findFirst({
        where: {
            id,
            year,
            branch,
            isDeleted: false,
        },
        include: {
            author: {
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    username: true,
                    role: true,
                },
            },
            answers: {
                where: { isDeleted: false },
                include: {
                    author: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            username: true,
                        },
                    },
                },
                orderBy: [
                    // Best answer first (if it exists)
                    { bestQuestionId: { sort: 'desc', nulls: 'last' } },
                    // Then by upvotes
                    { upvotes: 'desc' },
                ],
            },
            bestAnswer: true,
            reactions: true, // Include reactions
        },
    });

    if (!question) {
        throw new AppError(404, 'Question not found');
    }

    return question;
};

/**
 * Update question (batch-scoped, author-only)
 */
export const updateQuestion = async (
    id: string,
    authorId: string,
    year: number,
    branch: string,
    data: {
        title?: string;
        content?: string;
        tags?: string[];
    }
) => {
    // Verify question exists and user is the author
    const existingQuestion = await prisma.question.findFirst({
        where: {
            id,
            year,
            branch,
            authorId,
            isDeleted: false,
        },
    });

    if (!existingQuestion) {
        throw new AppError(404, 'Question not found or you are not the author');
    }

    const updatedQuestion = await prisma.question.update({
        where: { id },
        data: {
            title: data.title ?? existingQuestion.title,
            content: data.content ?? existingQuestion.content,
            tags: data.tags ?? existingQuestion.tags,
        },
        include: {
            author: {
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                },
            },
            answers: {
                where: { isDeleted: false },
                include: {
                    author: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            username: true,
                        },
                    },
                },
            },
            bestAnswer: true,
        },
    });

    return updatedQuestion;
};

/**
 * Soft delete question (batch-scoped, author-only)
 */
export const deleteQuestion = async (
    id: string,
    authorId: string,
    year: number,
    branch: string
) => {
    // Verify question exists and user is the author
    const existingQuestion = await prisma.question.findFirst({
        where: {
            id,
            year,
            branch,
            authorId,
            isDeleted: false,
        },
    });

    if (!existingQuestion) {
        throw new AppError(404, 'Question not found or you are not the author');
    }

    await prisma.question.update({
        where: { id },
        data: { isDeleted: true },
    });

    return { message: 'Question deleted successfully' };
};

/**
 * Create an answer to a question (batch-scoped)
 */
export const createAnswer = async (
    questionId: string,
    data: {
        content: string;
        authorId: string;
    },
    year: number,
    branch: string
) => {
    // Verify question exists in the same batch
    const question = await prisma.question.findFirst({
        where: {
            id: questionId,
            year,
            branch,
            isDeleted: false,
        },
    });

    if (!question) {
        throw new AppError(404, 'Question not found');
    }

    const answer = await prisma.answer.create({
        data: {
            content: data.content,
            authorId: data.authorId,
            questionId: questionId,
            year: year,
            branch: branch,
        },
        include: {
            author: {
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    username: true,
                },
            },
        },
    });

    return answer;
};

/**
 * Delete answer (batch-scoped, author-only)
 */
export const deleteAnswer = async (
    questionId: string,
    answerId: string,
    authorId: string,
    year: number,
    branch: string
) => {
    // Verify answer exists and user is the author
    const existingAnswer = await prisma.answer.findFirst({
        where: {
            id: answerId,
            questionId,
            year,
            branch,
            authorId,
            isDeleted: false,
        },
    });

    if (!existingAnswer) {
        throw new AppError(404, 'Answer not found or you are not the author');
    }

    await prisma.answer.update({
        where: { id: answerId },
        data: { isDeleted: true },
    });

    return { message: 'Answer deleted successfully' };
};

/**
 * Vote on a question
 */
export const voteQuestion = async (
    id: string,
    voteType: 'upvote' | 'downvote',
    year: number,
    branch: string
) => {
    // Verify question exists in batch
    const question = await prisma.question.findFirst({
        where: {
            id,
            year,
            branch,
            isDeleted: false,
        },
    });

    if (!question) {
        throw new AppError(404, 'Question not found');
    }

    // Update vote count
    const updatedQuestion = await prisma.question.update({
        where: { id },
        data: {
            upvotes: voteType === 'upvote' ? { increment: 1 } : question.upvotes,
            downvotes: voteType === 'downvote' ? { increment: 1 } : question.downvotes,
        },
    });

    return updatedQuestion;
};

/**
 * Vote on an answer
 */
export const voteAnswer = async (
    answerId: string,
    voteType: 'upvote' | 'downvote',
    year: number,
    branch: string
) => {
    // Verify answer exists in batch
    const answer = await prisma.answer.findFirst({
        where: {
            id: answerId,
            year,
            branch,
            isDeleted: false,
        },
    });

    if (!answer) {
        throw new AppError(404, 'Answer not found');
    }

    // Update vote count
    const updatedAnswer = await prisma.answer.update({
        where: { id: answerId },
        data: {
            upvotes: voteType === 'upvote' ? { increment: 1 } : answer.upvotes,
            downvotes: voteType === 'downvote' ? { increment: 1 } : answer.downvotes,
        },
    });

    return updatedAnswer;
};

/**
 * Mark an answer as the best answer for a question (question author only)
 */
export const markBestAnswer = async (
    questionId: string,
    answerId: string,
    authorId: string,
    year: number,
    branch: string
) => {
    // Verify question exists and user is the author
    const question = await prisma.question.findFirst({
        where: {
            id: questionId,
            year,
            branch,
            authorId,
            isDeleted: false,
        },
    });

    if (!question) {
        throw new AppError(404, 'Question not found or you are not the question author');
    }

    // Verify answer exists and belongs to this question
    const answer = await prisma.answer.findFirst({
        where: {
            id: answerId,
            questionId,
            year,
            branch,
            isDeleted: false,
        },
    });

    if (!answer) {
        throw new AppError(404, 'Answer not found');
    }

    // Update question with best answer
    const updatedQuestion = await prisma.question.update({
        where: { id: questionId },
        data: {
            bestAnswerId: answerId,
        },
        include: {
            author: {
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    username: true,
                },
            },
            bestAnswer: true,
        },
    });

    return updatedQuestion;
};

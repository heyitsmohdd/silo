// 
// Academic Questions Service Layer
// Business logic for Q&A CRUD with strict batch isolation


import { prisma } from '../../shared/lib/prisma.js';
import { AppError } from '../../shared/middleware/error.middleware.js';
import { Prisma } from '@prisma/client';

// 
// Create a new question (batch-scoped)

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

// 
// Get all questions (batch-scoped with filters)

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
                orderBy: [
                    { bestQuestionId: { sort: 'desc', nulls: 'last' } },
                    { upvotes: 'desc' },
                    { createdAt: 'desc' },
                ],
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

// 
// Get single question by ID (batch-scoped) with all answers

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
                    // Then by newest
                    { createdAt: 'desc' },
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

// 
// Update question (batch-scoped, author-only)

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

// 
// Soft delete question (batch-scoped, author-only)

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

// 
// Create an answer to a question (batch-scoped)

export const createAnswer = async (
    questionId: string,
    data: {
        content: string;
        authorId: string;
        parentId?: string;
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

    // If parentId is provided, verify it exists and belongs to the same question
    if (data.parentId) {
        const parentAnswer = await prisma.answer.findFirst({
            where: {
                id: data.parentId,
                questionId,
                isDeleted: false,
            },
        });

        if (!parentAnswer) {
            throw new AppError(404, 'Parent answer not found');
        }
    }

    const answer = await prisma.answer.create({
        data: {
            content: data.content,
            authorId: data.authorId,
            questionId: questionId,
            parentId: data.parentId,
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

    // Trigger REPLY notification
    const { createNotification } = await import('../notifications/notifications.service.js');

    // Notify question author
    if (question.authorId !== data.authorId) {
        await createNotification(
            question.authorId,
            data.authorId,
            'REPLY',
            'replied to your question',
            question.id
        );
    }

    // If replying to a comment, also notify parent comment author
    if (data.parentId) {
        const parentAnswer = await prisma.answer.findUnique({
            where: { id: data.parentId },
            select: { authorId: true },
        });

        if (parentAnswer && parentAnswer.authorId !== data.authorId && parentAnswer.authorId !== question.authorId) {
            await createNotification(
                parentAnswer.authorId,
                data.authorId,
                'REPLY',
                'replied to your comment',
                question.id
            );
        }
    }

    return answer;
};

// 
// Delete answer (batch-scoped, author-only)

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

// 
// Vote on a question

export const voteQuestion = async (
    id: string,
    voteType: 'upvote' | 'downvote',
    voterId: string,
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

    // Check for existing upvote
    const existingUpvote = await prisma.upvote.findUnique({
        where: {
            userId_questionId: {
                userId: voterId,
                questionId: id,
            },
        },
    });

    // If upvoting and no existing upvote, create one
    if (voteType === 'upvote' && !existingUpvote) {
        await prisma.$transaction(async (tx) => {
            // Create upvote record
            await tx.upvote.create({
                data: {
                    userId: voterId,
                    questionId: id,
                    targetAuthorId: question.authorId,
                },
            });

            // Increment count
            await tx.question.update({
                where: { id },
                data: { upvotes: { increment: 1 } },
            });
        });

        // Trigger UPVOTE notification (outside transaction to avoid blocking)
        if (question.authorId !== voterId) {
            const { createNotification } = await import('../notifications/notifications.service.js');
            await createNotification(
                question.authorId,
                voterId,
                'UPVOTE',
                'upvoted your question',
                question.id
            );
        }
    }
    // If downvoting (removing upvote) and existing upvote exists, delete it
    else if (voteType === 'downvote' && existingUpvote) {
        await prisma.$transaction(async (tx) => {
            // Delete upvote record
            await tx.upvote.delete({
                where: { id: existingUpvote.id },
            });

            // Decrement count
            await tx.question.update({
                where: { id },
                data: { upvotes: { decrement: 1 } },
            });
        });
    }

    // Return updated question
    return await prisma.question.findUnique({ where: { id } });
};

// 
// Vote on an answer

export const voteAnswer = async (
    answerId: string,
    voteType: 'upvote' | 'downvote',
    voterId: string,
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

    // Check for existing upvote
    const existingUpvote = await prisma.upvote.findUnique({
        where: {
            userId_answerId: {
                userId: voterId,
                answerId,
            },
        },
    });

    // If upvoting and no existing upvote, create one
    if (voteType === 'upvote' && !existingUpvote) {
        await prisma.$transaction(async (tx) => {
            // Create upvote record
            await tx.upvote.create({
                data: {
                    userId: voterId,
                    answerId,
                    targetAuthorId: answer.authorId,
                },
            });

            // Increment count
            await tx.answer.update({
                where: { id: answerId },
                data: { upvotes: { increment: 1 } },
            });
        });

        // Trigger UPVOTE notification
        if (answer.authorId !== voterId) {
            const { createNotification } = await import('../notifications/notifications.service.js');
            const questionId = answer.questionId;
            await createNotification(
                answer.authorId,
                voterId,
                'UPVOTE',
                'upvoted your answer',
                questionId
            );
        }
    }
    // If downvoting (removing upvote) and existing upvote exists, delete it
    else if (voteType === 'downvote' && existingUpvote) {
        await prisma.$transaction(async (tx) => {
            // Delete upvote record
            await tx.upvote.delete({
                where: { id: existingUpvote.id },
            });

            // Decrement count
            await tx.answer.update({
                where: { id: answerId },
                data: { upvotes: { decrement: 1 } },
            });
        });
    }

    // Return updated answer
    return await prisma.answer.findUnique({ where: { id: answerId } });
};

// 
// Mark an answer as the best answer for a question (question author only)

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

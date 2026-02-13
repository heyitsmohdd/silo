/**
 * Academic Domain Zod Schemas
 * Validation for Notes and Messages
 */

import { z } from 'zod';

/**
 * Create Note Request Schema
 */
export const CreateNoteSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    content: z.string().min(1, 'Content is required').max(50000, 'Content too long'),
    subject: z.string().min(1, 'Subject is required').max(100, 'Subject name too long'),
    fileUrl: z.string().url().optional(),
    fileType: z.string().max(50).optional(),
});

export type CreateNoteInput = z.infer<typeof CreateNoteSchema>;

/**
 * Update Note Request Schema
 */
export const UpdateNoteSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    content: z.string().min(1).max(50000).optional(),
    subject: z.string().min(1).max(100).optional(),
    fileUrl: z.string().url().optional(),
    fileType: z.string().max(50).optional(),
});

export type UpdateNoteInput = z.infer<typeof UpdateNoteSchema>;

/**
 * Create Message Request Schema
 */
export const CreateMessageSchema = z.object({
    content: z.string().min(1, 'Message cannot be empty').max(5000, 'Message too long'),
    roomId: z.string().min(1, 'Room ID is required'),
});

export type CreateMessageInput = z.infer<typeof CreateMessageSchema>;

/**
 * Query Filters Schema
 */
export const NoteQuerySchema = z.object({
    subject: z.string().optional(),
    search: z.string().optional(),
    limit: z.number().int().min(1).max(100).default(20),
    offset: z.number().int().min(0).default(0),
});

export type NoteQueryInput = z.infer<typeof NoteQuerySchema>;

/**
 * Helper: Parse functions
 */
export const parseCreateNote = (data: unknown): CreateNoteInput => {
    return CreateNoteSchema.parse(data);
};

export const parseUpdateNote = (data: unknown): UpdateNoteInput => {
    return UpdateNoteSchema.parse(data);
};

export const parseCreateMessage = (data: unknown): CreateMessageInput => {
    return CreateMessageSchema.parse(data);
};

export const parseNoteQuery = (data: unknown): NoteQueryInput => {
    return NoteQuerySchema.parse(data);
};

// ============================================================================
// Q&A SCHEMAS
// ============================================================================

/**
 * Create Question Request Schema
 */
export const CreateQuestionSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title too long'),
    content: z.string().min(10, 'Content must be at least 10 characters').max(2000, 'Question too long - max 2000 characters'),
    tags: z.string().min(1, 'At least one tag is required').max(200, 'Tags too long'),
});

export type CreateQuestionInput = z.infer<typeof CreateQuestionSchema>;

/**
 * Update Question Request Schema
 */
export const UpdateQuestionSchema = z.object({
    title: z.string().min(5).max(200).optional(),
    content: z.string().min(10).max(2000).optional(),
    tags: z.string().max(200).optional(),
});

export type UpdateQuestionInput = z.infer<typeof UpdateQuestionSchema>;

/**
 * Create Answer Request Schema
 */
export const CreateAnswerSchema = z.object({
    content: z.string().min(10, 'Answer must be at least 10 characters').max(2000, 'Answer too long - max 2000 characters'),
    parentId: z.string().uuid().optional(),
});

export type CreateAnswerInput = z.infer<typeof CreateAnswerSchema>;

/**
 * Vote Request Schema
 */
export const VoteSchema = z.object({
    voteType: z.enum(['upvote', 'downvote'], { required_error: 'Vote type is required' }),
});

export type VoteInput = z.infer<typeof VoteSchema>;

/**
 * Question Query Filters Schema
 */
export const QuestionQuerySchema = z.object({
    tags: z.string().optional(),
    search: z.string().optional(),
    sortBy: z.enum(['newest', 'oldest', 'upvotes']).default('newest'),
    limit: z.number().int().min(1).max(100).default(20),
    offset: z.number().int().min(0).default(0),
});

export type QuestionQueryInput = z.infer<typeof QuestionQuerySchema>;

/**
 * Best Answer Request Schema
 */
export const BestAnswerSchema = z.object({
    answerId: z.string().uuid('Invalid answer ID'),
});

export type BestAnswerInput = z.infer<typeof BestAnswerSchema>;

/**
 * Q&A Helper: Parse functions
 */
export const parseCreateQuestion = (data: unknown): CreateQuestionInput => {
    return CreateQuestionSchema.parse(data);
};

export const parseUpdateQuestion = (data: unknown): UpdateQuestionInput => {
    return UpdateQuestionSchema.parse(data);
};

export const parseCreateAnswer = (data: unknown): CreateAnswerInput => {
    return CreateAnswerSchema.parse(data);
};

export const parseVote = (data: unknown): VoteInput => {
    return VoteSchema.parse(data);
};

export const parseQuestionQuery = (data: unknown): QuestionQueryInput => {
    return QuestionQuerySchema.parse(data);
};

export const parseBestAnswer = (data: unknown): BestAnswerInput => {
    return BestAnswerSchema.parse(data);
};


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

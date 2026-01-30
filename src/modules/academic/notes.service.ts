/**
 * Academic Notes Service Layer
 * Business logic for notes CRUD with strict batch isolation
 */

import { prisma } from '../../shared/lib/prisma.js';
import { AppError } from '../../shared/middleware/error.middleware.js';
import { Prisma } from '@prisma/client';

/**
 * Create a new note (batch-scoped)
 */
export const createNote = async (
    data: {
        title: string;
        content: string;
        subject: string;
        authorId: string;
        fileUrl?: string;
        fileType?: string;
    },
    year: number,
    branch: string
) => {
    const note = await prisma.note.create({
        data: {
            title: data.title,
            content: data.content,
            subject: data.subject,
            authorId: data.authorId,
            year: year,
            branch: branch,
            fileUrl: data.fileUrl ?? null,
            fileType: data.fileType ?? null,
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
        },
    });

    return note;
};

/**
 * Get all notes (batch-scoped with filters)
 */
export const getNotes = async (
    year: number,
    branch: string,
    filters?: {
        subject?: string;
        search?: string;
        limit?: number;
        offset?: number;
    }
) => {
    const where: Prisma.NoteWhereInput = {
        year,
        branch,
        isDeleted: false,
    };

    // Optional subject filter
    if (filters?.subject) {
        where.subject = filters.subject;
    }

    // Optional search filter (searches in title and content)
    if (filters?.search) {
        where.OR = [
            { title: { contains: filters.search, mode: 'insensitive' } },
            { content: { contains: filters.search, mode: 'insensitive' } },
        ];
    }

    const notes = await prisma.note.findMany({
        where,
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
        },
        orderBy: { createdAt: 'desc' },
        take: filters?.limit ?? 20,
        skip: filters?.offset ?? 0,
    });

    const total = await prisma.note.count({ where });

    return { notes, total };
};

/**
 * Get single note by ID (batch-scoped)
 */
export const getNoteById = async (
    id: string,
    year: number,
    branch: string
) => {
    const note = await prisma.note.findFirst({
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
                    role: true,
                },
            },
        },
    });

    if (!note) {
        throw new AppError(404, 'Note not found');
    }

    return note;
};

/**
 * Update note (batch-scoped, author-only)
 */
export const updateNote = async (
    id: string,
    authorId: string,
    year: number,
    branch: string,
    data: {
        title?: string;
        content?: string;
        subject?: string;
        fileUrl?: string;
        fileType?: string;
    }
) => {
    // Verify note exists and user is the author
    const existingNote = await prisma.note.findFirst({
        where: {
            id,
            year,
            branch,
            authorId,
            isDeleted: false,
        },
    });

    if (!existingNote) {
        throw new AppError(404, 'Note not found or you are not the author');
    }

    const updatedNote = await prisma.note.update({
        where: { id },
        data: {
            title: data.title ?? existingNote.title,
            content: data.content ?? existingNote.content,
            subject: data.subject ?? existingNote.subject,
            fileUrl: data.fileUrl ?? existingNote.fileUrl,
            fileType: data.fileType ?? existingNote.fileType,
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
        },
    });

    return updatedNote;
};

/**
 * Soft delete note (batch-scoped, author-only)
 */
export const deleteNote = async (
    id: string,
    authorId: string,
    year: number,
    branch: string
) => {
    // Verify note exists and user is the author
    const existingNote = await prisma.note.findFirst({
        where: {
            id,
            year,
            branch,
            authorId,
            isDeleted: false,
        },
    });

    if (!existingNote) {
        throw new AppError(404, 'Note not found or you are not the author');
    }

    await prisma.note.update({
        where: { id },
        data: { isDeleted: true },
    });

    return { message: 'Note deleted successfully' };
};

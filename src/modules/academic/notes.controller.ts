/**
 * Academic Notes Controller
 * Request handlers for notes routes
 */

import { Response } from 'express';
import { AuthenticatedRequest } from '../../shared/types/express.types.js';
import {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote,
} from './notes.service.js';
import {
    parseCreateNote,
    parseUpdateNote,
    parseNoteQuery,
} from '../../shared/schemas/academic.schema.js';

/**
 * GET /academic/notes
 * List all notes (batch-scoped with filters)
 */
export const listNotes = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    if (!req.context) {
        res.status(403).json({ error: 'Batch context required' });
        return;
    }

    const { year, branch } = req.context;

    // Parse query parameters
    const filters = parseNoteQuery({
        subject: req.query['subject'],
        search: req.query['search'],
        limit: req.query['limit'] ? parseInt(req.query['limit'] as string) : 20,
        offset: req.query['offset'] ? parseInt(req.query['offset'] as string) : 0,
    });

    const { notes, total } = await getNotes(year, branch, filters);

    res.status(200).json({
        notes,
        total,
        limit: filters.limit,
        offset: filters.offset,
    });
};

/**
 * POST /academic/notes
 * Create a new note
 */
export const createNoteHandler = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    if (!req.user || !req.context) {
        res.status(403).json({ error: 'Authentication required' });
        return;
    }

    const data = parseCreateNote(req.body);
    // Explicitly using req.user to guarantee the source of truth from the token
    const { year, branch } = req.user;

    const note = await createNote({
        ...data,
        authorId: req.user.userId,
        year,
        branch,
    });

    res.status(201).json({
        message: 'Note created successfully',
        note,
    });
};

/**
 * GET /academic/notes/:id
 * Get single note by ID
 */
export const getNoteHandler = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    if (!req.context) {
        res.status(403).json({ error: 'Batch context required' });
        return;
    }

    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: 'Note ID is required' });
        return;
    }

    const { year, branch } = req.context;

    const note = await getNoteById(id, year, branch);

    res.status(200).json({ note });
};

/**
 * PUT /academic/notes/:id
 * Update a note (author-only)
 */
export const updateNoteHandler = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    if (!req.user || !req.context) {
        res.status(403).json({ error: 'Authentication required' });
        return;
    }

    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: 'Note ID is required' });
        return;
    }

    const data = parseUpdateNote(req.body);
    const { year, branch } = req.context;

    const note = await updateNote(id, req.user.userId, year, branch, data);

    res.status(200).json({
        message: 'Note updated successfully',
        note,
    });
};

/**
 * DELETE /academic/notes/:id
 * Soft delete a note (author-only)
 */
export const deleteNoteHandler = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    if (!req.user || !req.context) {
        res.status(403).json({ error: 'Authentication required' });
        return;
    }

    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: 'Note ID is required' });
        return;
    }

    const { year, branch } = req.context;

    const result = await deleteNote(id, req.user.userId, year, branch);

    res.status(200).json(result);
};

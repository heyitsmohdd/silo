// 
// Academic Notes Routes


import { Router } from 'express';
import {
    listNotes,
    createNoteHandler,
    getNoteHandler,
    updateNoteHandler,
    deleteNoteHandler,
} from './notes.controller.js';
import { requireAuth } from '../../shared/middleware/auth.middleware.js';

const router = Router();

// 
// All routes require authentication and batch context

router.use(requireAuth);

// 
// GET /academic/notes
// List all notes (batch-scoped)
// Query params: ?subject=CS&search=query&limit=20&offset=0

router.get('/notes', async (req, res, next) => {
    try {
        await listNotes(req, res);
    } catch (error) {
        next(error);
    }
});

// 
// POST /academic/notes
// Create a new note

router.post('/notes', async (req, res, next) => {
    try {
        await createNoteHandler(req, res);
    } catch (error) {
        next(error);
    }
});

// 
// GET /academic/notes/:id
// Get single note by ID (batch-scoped)

router.get('/notes/:id', async (req, res, next) => {
    try {
        await getNoteHandler(req, res);
    } catch (error) {
        next(error);
    }
});

// 
// PUT /academic/notes/:id
// Update a note (author-only)

router.put('/notes/:id', async (req, res, next) => {
    try {
        await updateNoteHandler(req, res);
    } catch (error) {
        next(error);
    }
});

// 
// DELETE /academic/notes/:id
// Soft delete a note (author-only)

router.delete('/notes/:id', async (req, res, next) => {
    try {
        await deleteNoteHandler(req, res);
    } catch (error) {
        next(error);
    }
});

export default router;

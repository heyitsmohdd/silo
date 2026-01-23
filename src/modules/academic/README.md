# Academic Module (Notes & File Metadata)

This module handles academic content (notes, files) with strict batch isolation.

## Structure (To be implemented)
- `routes/` - Express routes for notes
- `controllers/` - Request handlers
- `services/` - Business logic for note CRUD
- `validators/` - Request validation

## Key Routes
- `GET /academic/notes` - List notes (filtered by batch context)
- `POST /academic/notes` - Create note
- `GET /academic/notes/:id` - Get single note
- `PUT /academic/notes/:id` - Update note
- `DELETE /academic/notes/:id` - Soft delete note

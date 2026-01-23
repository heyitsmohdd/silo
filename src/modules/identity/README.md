# Identity Module (Authentication & Authorization)

This module handles user authentication, JWT generation, and access control.

## Structure (To be implemented)
- `routes/` - Express routes for auth endpoints
- `controllers/` - Request handlers
- `services/` - Business logic for user management
- `validators/` - Request validation middleware

## Key Routes
- `POST /auth/login` - User login with email/password
- `POST /auth/register` - User registration
- `POST /auth/logout` - Token invalidation (optional)

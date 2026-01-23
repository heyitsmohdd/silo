# The Academic Vault - Quick Start Guide

## 🚀 Your MVP is Ready!

A production-grade multi-tenant academic platform with **strict batch isolation**.

---

## What You Have

✅ **Self-Registration** - Students/Professors sign up instantly  
✅ **JWT Authentication** - Secure token-based auth  
✅ **Notes CRUD** - Create, read, update, delete notes  
✅ **Batch Isolation** - Year 2026 CS can't see Year 2025 Mech notes  
✅ **Author-Only Actions** - Can only edit/delete your own notes  
✅ **Soft Deletes** - Data retained for audit trails  
✅ **Type Safety** - Strict TypeScript + Zod validation  

---

## Start the Server

```bash
npm run dev
```

Server runs on `http://localhost:3000`

---

## Test in 60 Seconds

### 1. Register a Student

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@college.edu",
    "password": "pass123",
    "role": "STUDENT",
    "year": 2026,
    "branch": "CS"
  }'
```

**Copy the `token` from response**

---

### 2. Create a Note

```bash
export TOKEN="YOUR_TOKEN_HERE"

curl -X POST http://localhost:3000/academic/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "My First Note",
    "content": "This is batch-isolated!",
    "subject": "Testing"
  }'
```

---

### 3. List Notes

```bash
curl http://localhost:3000/academic/notes \
  -H "Authorization: Bearer $TOKEN"
```

---

## API Endpoints

### Authentication
- `POST /auth/register` - Sign up
- `POST /auth/login` - Login
- `GET /auth/me` - Current user

### Notes (All require JWT)
- `GET /academic/notes` - List notes (batch-scoped)
- `POST /academic/notes` - Create note
- `GET /academic/notes/:id` - Get single note
- `PUT /academic/notes/:id` - Update note
- `DELETE /academic/notes/:id` - Delete note

---

## Testing Batch Isolation

See detailed guide: [TEST_NOTES.md](file:///Users/shariqattar/Developer/silo/TEST_NOTES.md)

**Quick test:**
1. Register 2 students from different batches (e.g., 2026 CS and 2025 Mech)
2. Each creates a note
3. Verify they can't see each other's notes ✅

---

## Architecture Highlights

### DDD Structure
```
src/modules/
  ├── identity/    - Auth (register, login)
  └── academic/    - Notes (CRUD)
```

### Batch Isolation
```typescript
// JWT contains (year, branch)
req.context = { year: 2026, branch: "CS" }

// All queries automatically scoped
prisma.note.findMany({
  where: {
    year: req.context.year,
    branch: req.context.branch
  }
})
```

### Security
- Bcrypt password hashing
- JWT with 7-day expiration
- Zod input validation
- Soft deletes only

---

## Files to Review

- [walkthrough.md](file:///Users/shariqattar/.gemini/antigravity/brain/079ba99d-826c-4f71-ac0c-43288eb9a0d1/walkthrough.md) - Complete architecture & demo guide
- [TEST_AUTH.md](file:///Users/shariqattar/Developer/silo/TEST_AUTH.md) - Auth testing
- [TEST_NOTES.md](file:///Users/shariqattar/Developer/silo/TEST_NOTES.md) - Notes testing
- [README.md](file:///Users/shariqattar/Developer/silo/README.md) - Project overview

---

## Next Steps

1. ✅ **Test the API** - Follow TEST_NOTES.md
2. 🎨 **Build Frontend** - React with Digital Brutalism theme
3. 💬 **Add Socket.io** - Real-time chat
4. 🎓 **Present!** - You have a production-ready MVP

---

## Need Help?

- Database issues? Check `.env` has correct PostgreSQL URL
- Auth errors? Make sure JWT_SECRET is set
- TypeScript errors? Run `npm run type-check`
- Server not starting? Check if port 3000 is free

---

**You're ready to present!** 🎉

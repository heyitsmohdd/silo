# Testing Academic Notes Module

## 🎯 Testing Batch Isolation

The Academic Vault's **killer feature** is strict batch isolation. This test proves that:
- Year 2026 CS students **CANNOT** see Year 2025 notes
- Year 2026 CS students **CANNOT** see Year 2026 Mech notes

---

## Prerequisites

1. **Server running**: `npm run dev`
2. **2 users registered** with different batches

---

## Test Scenario: Batch Isolation

### Step 1: Register Two Students from Different Batches

**Student 1 (2026, CS):**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cs2026@test.com",
    "password": "pass123",
    "role": "STUDENT",
    "year": 2026,
    "branch": "CS",
    "firstName": "Alice"
  }'
```

Save the token: `CS_TOKEN="eyJhbGciOi..."`

---

**Student 2 (2025, Mech):**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mech2025@test.com",
    "password": "pass123",
    "role": "STUDENT",
    "year": 2025,
    "branch": "MECH",
    "firstName": "Bob"
  }'
```

Save the token: `MECH_TOKEN="eyJhbGciOi..."`

---

### Step 2: CS Student Creates a Note

```bash
curl -X POST http://localhost:3000/academic/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CS_TOKEN" \
  -d '{
    "title": "Data Structures Cheat Sheet",
    "content": "Binary trees, linked lists, hash tables...",
    "subject": "Data Structures"
  }'
```

**Expected Response:**
```json
{
  "message": "Note created successfully",
  "note": {
    "id": "uuid-here",
    "title": "Data Structures Cheat Sheet",
    "year": 2026,
    "branch": "CS",
    "author": {
      "firstName": "Alice",
      "role": "STUDENT"
    }
  }
}
```

---

### Step 3: Mech Student Creates a Note

```bash
curl -X POST http://localhost:3000/academic/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MECH_TOKEN" \
  -d '{
    "title": "Thermodynamics Formulas",
    "content": "PV = nRT, entropy equations...",
    "subject": "Thermodynamics"
  }'
```

---

### Step 4: Verify Batch Isolation

**CS Student Lists Notes:**
```bash
curl http://localhost:3000/academic/notes \
  -H "Authorization: Bearer $CS_TOKEN"
```

**Expected:**
- ✅ Shows "Data Structures Cheat Sheet"
- ❌ **DOES NOT** show "Thermodynamics Formulas"

---

**Mech Student Lists Notes:**
```bash
curl http://localhost:3000/academic/notes \
  -H "Authorization: Bearer $MECH_TOKEN"
```

**Expected:**
- ✅ Shows "Thermodynamics Formulas"
- ❌ **DOES NOT** show "Data Structures Cheat Sheet"

---

## More Tests

### Search Notes (Batch-Scoped)
```bash
curl "http://localhost:3000/academic/notes?search=data" \
  -H "Authorization: Bearer $CS_TOKEN"
```

### Filter by Subject
```bash
curl "http://localhost:3000/academic/notes?subject=Data%20Structures" \
  -H "Authorization: Bearer $CS_TOKEN"
```

### Pagination
```bash
curl "http://localhost:3000/academic/notes?limit=10&offset=0" \
  -H "Authorization: Bearer $CS_TOKEN"
```

### Get Single Note
```bash
curl http://localhost:3000/academic/notes/NOTE_ID \
  -H "Authorization: Bearer $CS_TOKEN"
```

### Update Note (Author Only)
```bash
curl -X PUT http://localhost:3000/academic/notes/NOTE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CS_TOKEN" \
  -d '{
    "title": "Updated Title",
    "content": "Updated content..."
  }'
```

### Delete Note (Soft Delete, Author Only)
```bash
curl -X DELETE http://localhost:3000/academic/notes/NOTE_ID \
  -H "Authorization: Bearer $CS_TOKEN"
```

---

## Security Features Tested

1. ✅ **Batch Isolation**: Year + Branch scoping on ALL queries
2. ✅ **Author-Only Updates**: Can't edit someone else's note
3. ✅ **Author-Only Deletes**: Can't delete someone else's note
4. ✅ **Soft Deletes**: Notes marked as deleted, not removed from DB
5. ✅ **JWT Authentication**: All routes require valid token

---

## Expected Error Cases

**Try to access note from different batch:**
```bash
curl http://localhost:3000/academic/notes/CS_NOTE_ID \
  -H "Authorization: Bearer $MECH_TOKEN"
```

**Expected:** `404 Note not found` (even though it exists!)

---

**Try to update someone else's note:**
```bash
curl -X PUT http://localhost:3000/academic/notes/ALICE_NOTE_ID \
  -H "Authorization: Bearer $BOB_TOKEN_SAME_BATCH" \
  -d '{"title": "Hacked"}'
```

**Expected:** `404 Note not found or you are not the author`

---

## API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/academic/notes` | Required | List notes (batch-scoped) |
| POST | `/academic/notes` | Required | Create note |
| GET | `/academic/notes/:id` | Required | Get single note |
| PUT | `/academic/notes/:id` | Required | Update note (author-only) |
| DELETE | `/academic/notes/:id` | Required | Soft delete note (author-only) |

All routes automatically enforce batch isolation via `requireAuth` middleware!

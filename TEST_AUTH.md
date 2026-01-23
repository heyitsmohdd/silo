# Testing Authentication Endpoints

## ✅ What's Already Built

Your self-registration authentication system is **COMPLETE** and includes:

- ✅ `POST /auth/register` - Instant account creation
- ✅ `POST /auth/login` - Email/password login
- ✅ `GET /auth/me` - Get current user (requires JWT)
- ✅ JWT tokens with `{ userId, email, role, year, branch }`
- ✅ Bcrypt password hashing
- ✅ Batch context enforcement via `requireBatchContext` middleware

---

## 🚀 How to Test

### Step 1: Start the Server

```bash
npm run dev
```

Keep this terminal running!

---

### Step 2: Test Registration (New Terminal)

**Register a Student:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student1@college.edu",
    "password": "securepass123",
    "role": "STUDENT",
    "year": 2026,
    "branch": "CS",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Expected Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid-here",
    "email": "student1@college.edu",
    "year": 2026,
    "branch": "CS",
    "role": "STUDENT",
    "firstName": "John",
    "lastName": "Doe",
    "isDeleted": false,
    "createdAt": "...",
    "updatedAt": "..."
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

**Register a Professor:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "prof1@college.edu",
    "password": "profpass123",
    "role": "PROFESSOR",
    "year": 2026,
    "branch": "CS",
    "firstName": "Jane",
    "lastName": "Smith"
  }'
```

---

### Step 3: Test Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student1@college.edu",
    "password": "securepass123"
  }'
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Step 4: Test Authenticated Endpoint

Copy the token from the login response and use it:

```bash
curl http://localhost:3000/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "user": {
    "userId": "...",
    "email": "student1@college.edu",
    "role": "STUDENT",
    "year": 2026,
    "branch": "CS"
  }
}
```

---

## 🔒 Security Features

1. **Batch Isolation**: JWT contains `(year, branch)` - no DB lookup needed
2. **Password Hashing**: Bcrypt with 10 rounds
3. **Soft Deletes**: Deactivated accounts blocked from login
4. **Duplicate Prevention**: Email uniqueness enforced
5. **Token Expiration**: JWT valid for 7 days

---

## 🎯 Next Steps

After testing authentication, build:
1. **Academic Module** - CRUD for notes with batch-scoped queries
2. **Socket.io** - Real-time chat with JWT authentication
3. **Frontend** - React with Digital Brutalism theme

---

## 📁 Architecture

```
src/modules/identity/
├── auth.service.ts     - Business logic (register, login, JWT)
├── auth.controller.ts  - Request handlers
└── auth.routes.ts      - Express routes

src/shared/middleware/
└── auth.middleware.ts  - JWT verification, batch context, RBAC
```

All data validation uses **Zod schemas** - invalid data never reaches the database!

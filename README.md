# Silo

**Strict Multi-Tenant Academic Platform** with Domain-Driven Design (DDD) architecture.

## 🎯 Core Principle: Batch Isolation

Students from **Year: 2026, Branch: CS** can **NEVER** access data from **Year: 2025** or **Branch: Mech**.

---

## 🏗️ Architecture

- **Backend**: Node.js, Express, TypeScript (strict mode)
- **Database**: PostgreSQL + Prisma ORM
- **Validation**: Zod (parse, don't validate)
- **Auth**: Stateless JWT with batch context
- **Real-time**: Socket.io (authenticated handshake)

---

## 📁 Project Structure (DDD)

```
src/
├── modules/               # Feature domains
│   ├── identity/         # Auth, JWT, RBAC
│   ├── academic/         # Notes, file metadata
│   ├── comm/             # Socket.io chat rooms
│   └── qna/              # Discussion threads
└── shared/               # Cross-cutting concerns
    ├── lib/              # Prisma client
    ├── middleware/       # Auth, error handling
    ├── schemas/          # Zod validation
    └── types/            # TypeScript interfaces
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your PostgreSQL URL and JWT secret
```

Generate JWT secret:
```bash
openssl rand -base64 64
```

### 3. Initialize Database
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Run Development Server
```bash
npm run dev
```

Server runs on `http://localhost:3000`

---

## 🔑 Key Features (Foundation)

### Multi-Tenant Batch Isolation
Every JWT contains `{ userId, role, year, branch }`. All queries are automatically scoped:
```typescript
// Student from Year 2026, CS can only see their batch's notes
const notes = await prisma.note.findMany({
  where: {
    year: req.context.year,    // From JWT
    branch: req.context.branch,
    isDeleted: false
  }
});
```

### Parse, Don't Validate (Zod)
All incoming data passes through strict Zod schemas:
```typescript
const data = parseCreateNote(req.body); // Throws on invalid data
// TypeScript knows exact shape at compile time
```

### Role-Based Access Control
Three roles: `SUPER_ADMIN`, `PROFESSOR`, `STUDENT`
```typescript
// Middleware factory
app.get('/admin/users', requireRole(Role.SUPER_ADMIN), handler);
```

### Soft Deletes Only
No hard deletes in application layer:
```typescript
await prisma.note.update({
  where: { id },
  data: { isDeleted: true }
});
```

---

## 📝 Scripts

```bash
npm run dev          # Development server with hot-reload
npm run build        # Compile TypeScript to dist/
npm run start        # Run production build
npm run type-check   # TypeScript validation without emit
```

### Prisma Commands
```bash
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Create/run migrations
npm run prisma:studio    # Database GUI
npm run prisma:push      # Push schema without migration
```

---

## 🗄️ Database Schema

### User
- UUID primary key
- Email authentication (bcrypt hashed)
- Batch context: `year`, `branch`
- Role: `SUPER_ADMIN | PROFESSOR | STUDENT`
- Soft delete flag

### Note
- UUID primary key
- Content, subject, file metadata
- Batch context: `year`, `branch`
- Author relation
- Soft delete flag

### Message
- UUID primary key
- Real-time chat content
- Room identifier
- Batch context: `year`, `branch`
- Anonymous sender tracking
- Soft delete flag

---

## 🔒 Security

### Authentication Flow
1. User logs in via `POST /auth/login` (to be implemented)
2. Server validates credentials, returns JWT
3. Client includes JWT in `Authorization: Bearer <token>` header
4. Middleware verifies JWT and injects `req.context = { year, branch }`
5. All queries are automatically batch-scoped

### Stateless Authentication
- No session storage
- JWT contains all authorization data
- Token expiration enforced
- Invalid tokens rejected at middleware layer

---

## 🎨 Frontend (To Be Implemented)

**Theme**: Digital Brutalism / Terminal Minimal
- Monospace fonts, high-contrast black & white
- Faculty toggle: Dark mode ↔ Light mode
- No landing pages - direct to dashboard after login
- High information density

---

## 📚 API Routes (To Be Implemented)

### Authentication
- `POST /auth/login` - Email/password login
- `POST /auth/register` - User registration

### Academic
- `GET /academic/notes` - List notes (batch-scoped)
- `POST /academic/notes` - Create note
- `GET /academic/notes/:id` - Get single note
- `PUT /academic/notes/:id` - Update note
- `DELETE /academic/notes/:id` - Soft delete note

### Real-time Chat (Socket.io)
- Authenticated handshake with JWT
- Batch-isolated chat rooms
- Anonymous student messaging

---

## 🧪 Type Safety

All code compiled with **strict TypeScript mode**:
- `strict: true`
- `noImplicitAny: true`
- `strictNullChecks: true`
- `noUncheckedIndexedAccess: true`
- All other strict flags enabled

Zero tolerance for unsafe operations.

---

## 📄 License

Private academic project.

---

## 🤝 Next Steps

1. Implement `/auth/login` endpoint with bcrypt
2. Create CRUD routes for academic notes
3. Set up Socket.io with JWT authentication
4. Build React frontend with Digital Brutalism theme
5. Deploy to production

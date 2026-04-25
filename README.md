<p align="center">
  <img src="client/public/icon-192.png" alt="Silo" width="72" height="72" />
</p>

<h1 align="center">Silo</h1>

<p align="center">
  A batch-isolated academic collaboration platform built for students.
  <br />
  <a href="https://github.com/heyitsmohdd/silo/issues">Report Bug</a> · <a href="https://github.com/heyitsmohdd/silo/issues">Request Feature</a>
</p>

<p align="center">
  <img src="https://github.com/heyitsmohdd/silo/actions/workflows/ci.yml/badge.svg" alt="Build Status" />
  <img src="https://img.shields.io/badge/version-1.0.0--beta-emerald" alt="Version" />
  <img src="https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen" alt="Node" />
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen" alt="PRs Welcome" />
</p>

---

## Overview

Silo gives students a private, organized space to collaborate — no WhatsApp chaos, no scattered Google Docs, no cross-batch pollution. Every student only sees content from their specific year and branch, and anonymity is built in by default.

**Built for students, by students.**

---

## Features

- **Q&A** — Ask questions anonymously, upvote answers, mark best answers, react with emojis
- **Batch Chat** — Real-time messaging with your batch via WebSocket, with GIF support and typing indicators
- **Direct Messages** — Private one-on-one messaging between students
- **Channels** — Public batch-scoped group channels (create, join, chat)
- **Notes Repository** — Centralized study materials per batch
- **Articles** — Write and read long-form posts within your batch
- **Leaderboard** — Track top contributors in your batch
- **Notifications** — In-app notification system with push support
- **Whitelist Access** — Only verified students can register

---

## Tech Stack

### Backend
| | Package | Version |
|---|---|---|
| Runtime | Node.js | `>=18.0.0` |
| Framework | Express | `4.18.2` |
| Language | TypeScript | `5.3.3` |
| Database | PostgreSQL (Neon serverless) | — |
| ORM | Prisma | `5.22.0` |
| Auth | JSON Web Token + bcryptjs | `9.0.2` / `2.4.3` |
| Real-time | Socket.io | `4.8.3` |
| Validation | Zod | `3.22.4` |
| Rate Limiting | express-rate-limit | `8.2.1` |
| Email | Nodemailer | `8.0.1` |
| Push Notifications | web-push | `3.6.7` |

### Frontend
| | Package | Version |
|---|---|---|
| Framework | React | `19.2.0` |
| Language | TypeScript | `5.9.3` |
| Build Tool | Vite | `7.2.4` |
| Styling | Tailwind CSS | `3.4.19` |
| State Management | Zustand | `5.0.10` |
| Server State | TanStack Query | `5.90.20` |
| HTTP Client | Axios | `1.13.4` |
| Real-time | Socket.io Client | `4.8.3` |
| Rich Text Editor | TipTap | `3.20.0` |
| Routing | React Router | `7.13.0` |
| Icons | Lucide React | `0.563.0` |
| Avatars | DiceBear API | — |

### Infrastructure
| | Service |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | Neon PostgreSQL |
| Version Control | GitHub |

---

## Project Structure

```
silo/
├── client/                       # React frontend (Vite)
│   ├── src/
│   │   ├── api/                  # API client functions
│   │   ├── components/           # Reusable UI components
│   │   │   ├── layout/           # BottomNav, NotificationBell, etc.
│   │   │   ├── channels/         # Channel list, create modal
│   │   │   └── ui/               # Button, Input, Dialog, Skeleton, etc.
│   │   ├── features/             # Feature modules
│   │   │   ├── auth/             # Login, Register
│   │   │   ├── chat/             # Batch chat (Socket.io)
│   │   │   ├── channels/         # Community channels
│   │   │   ├── dm/               # Direct messages
│   │   │   ├── qna/              # Q&A system
│   │   │   ├── notes/            # Notes repository
│   │   │   ├── articles/         # Articles / long-form posts
│   │   │   └── profile/          # User profile, edit, modals
│   │   ├── hooks/                # Custom React hooks
│   │   ├── layouts/              # DashboardLayout
│   │   ├── lib/                  # axios, identity, utils
│   │   ├── pages/                # Leaderboard, Settings, Landing
│   │   └── stores/               # Zustand auth store
│   └── public/                   # Static assets, PWA icons
│
├── src/                          # Express backend
│   ├── modules/
│   │   ├── identity/             # Auth, user management
│   │   ├── academic/             # Notes, Q&A, questions, answers, reactions
│   │   ├── comm/                 # Chat, DMs, channels, notifications
│   │   └── social/               # (planned) Follow system
│   └── shared/
│       ├── lib/                  # Prisma client, JWT helpers
│       ├── middleware/           # Auth guard, rate limiter
│       └── types/                # Shared TypeScript types
│
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Seed script for allowed emails
│
└── scripts/                      # Utility scripts (waitlist approval, etc.)
```

---

## Getting Started

### Prerequisites

- Node.js `>=18.0.0`
- npm `>=9.0.0`
- PostgreSQL database ([Neon](https://neon.tech) recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/heyitsmohdd/silo.git
   cd silo
   ```

2. **Install dependencies**
   ```bash
   # Backend
   npm install

   # Frontend
   cd client && npm install && cd ..
   ```

3. **Configure environment variables**

   Backend `.env`:
   ```env
   DATABASE_URL="postgresql://..."
   JWT_SECRET="your-secret-key"
   PORT=3000
   CLIENT_URL="http://localhost:5173"
   ```

   Frontend `client/.env`:
   ```env
   VITE_API_URL="http://localhost:3000"
   ```

4. **Initialize the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start development servers**
   ```bash
   # Terminal 1 — Backend
   npm run dev

   # Terminal 2 — Frontend
   cd client && npm run dev
   ```

Frontend: `http://localhost:5173` · Backend: `http://localhost:3000`

---

## API Reference

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register (requires whitelisted email) |
| `POST` | `/auth/login` | Login with email + password |
| `GET` | `/auth/me` | Get current user |
| `PUT` | `/auth/me` | Update profile |
| `PUT` | `/auth/change-password` | Change password |

### Q&A
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/academic/questions` | List questions (batch-scoped, paginated) |
| `POST` | `/academic/questions` | Create question (rate-limited: 5/hr) |
| `GET` | `/academic/questions/:id` | Get question with answers |
| `PUT` | `/academic/questions/:id` | Update question (author only) |
| `DELETE` | `/academic/questions/:id` | Soft delete (author only) |
| `POST` | `/academic/questions/:id/answers` | Post an answer |
| `POST` | `/academic/questions/:id/vote` | Upvote / downvote question |
| `PUT` | `/academic/questions/:id/best-answer` | Mark best answer (author only) |
| `POST` | `/academic/reactions` | Toggle emoji reaction |

### Notes
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/academic/notes` | List notes (batch-scoped) |
| `POST` | `/academic/notes` | Upload note (professor only) |
| `GET` | `/academic/notes/:id` | Get note details |

### Chat (Socket.io events)
| Event | Direction | Description |
|---|---|---|
| `connect` | Client → Server | Authenticate and join batch room |
| `sendMessage` | Client → Server | Send message to batch |
| `getMessages` | Client → Server | Fetch message history |
| `typing` | Client → Server | Broadcast typing indicator |
| `newMessage` | Server → Client | Receive new message |

---

## User Management

### Whitelist a User

**Option 1 — Prisma Studio (GUI)**
```bash
DATABASE_URL="your-production-url" npx prisma studio
```
Open `AllowedEmail` table → add email → save.

**Option 2 — Seed Script**

Edit `prisma/seed.ts` and add emails, then run:
```bash
npm run prisma:seed
```

**Option 3 — Approve Waitlist**
```bash
npm run approve-all
```

---

## Deployment

### Backend → Render
Push to `main` — Render auto-deploys. Set env vars in the Render dashboard.

### Frontend → Vercel
Push to `main` — Vercel auto-deploys. Set env vars in the Vercel dashboard.

### Database → Neon
Serverless PostgreSQL with connection pooling and automatic backups. Run migrations after schema changes:
```bash
npx prisma migrate deploy
```

---

## Security

- Whitelist-based registration — only approved emails can sign up
- bcrypt password hashing (salt rounds: 10)
- JWT authentication with expiration
- Rate limiting: 5 questions/hour, 30 messages/minute
- Batch isolation — all queries scoped by `(year, branch)`
- Zod schema validation on all inputs
- SQL injection prevention via Prisma ORM
- CORS and environment variable protection

---

## Known Limitations (Beta)

- Professor accounts must be added manually via the database
- No email notifications yet
- No content moderation beyond rate limits
- Manual user management required

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a PR.

Check [open issues](https://github.com/heyitsmohdd/silo/issues) for things to work on — some are tagged `good first issue`.

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

## Contact

Open an issue or email `siloedu00@gmail.com`.

---

<p align="center">
  <sub>version 1.0.0-beta · last updated April 2026</sub>
</p>

# Silo

![Build Status](https://github.com/heyitsmohdd/silo/actions/workflows/ci.yml/badge.svg)

A batch-isolated academic collaboration platform that provides students with a private space to share notes, ask questions, and communicate without the noise of chaotic WhatsApp groups or scattered Google Docs.

**Built for students, by students.**

## Why Silo?

Traditional student collaboration tools have several problems:
- **WhatsApp groups** become chaotic with hundreds of messages, making it hard to find important information
- **Google Docs** get scattered across drives with no central organization
- **Public forums** lack privacy and make students hesitant to ask questions
- **Cross-batch pollution** where resources get mixed between different years and branches

Silo solves these by providing:
- **Batch isolation**: Students only see content from their specific year and branch
- **True anonymity**: Random usernames protect student identity when asking sensitive questions
- **Organized knowledge**: Dedicated spaces for notes, questions, and real-time chat
- **VIP access control**: Whitelist-based registration ensures only verified students can join

## Features

### For Students
- **Q&A System**: Ask questions and get answers from batchmates anonymously
- **Real-time Chat**: Instant messaging with your batch (rate-limited to prevent spam)
- **Notes Repository**: Access study materials and resources (currently professor-upload only)
- **Profile Management**: Customize your username and view your activity

### Security & Privacy
- **Whitelist-based registration**: Only approved emails can create accounts
- **Anonymous usernames**: Random generated usernames protect identity
- **Batch isolation**: Complete separation between different years and branches
- **Rate limiting**: Prevents spam (5 questions/hour, 30 messages/minute)
- **No professor accounts**: Beta launch is student-only for safety

## Tech Stack

### Backend
- **Runtime**: Node.js with Express
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL (Neon serverless)
- **ORM**: Prisma
- **Authentication**: JWT with bcrypt password hashing
- **Real-time**: Socket.io for chat
- **Validation**: Zod schemas
- **Rate Limiting**: express-rate-limit

### Frontend
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **UI Components**: Custom component library

### Infrastructure
- **Backend Deploy**: Render (auto-deploy from GitHub)
- **Frontend Deploy**: Vercel (auto-deploy from GitHub)
- **Database**: Neon PostgreSQL (serverless)
- **Version Control**: Git/GitHub

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (or Neon account)
- Git

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
   cd client
   npm install
   cd ..
   ```

3. **Configure environment variables**
   ```bash
   # Backend .env
   DATABASE_URL="postgresql://..."
   JWT_SECRET="your-secret-key"
   PORT=3000
   
   # Frontend .env
   VITE_API_URL="http://localhost:3000"
   ```

4. **Initialize database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start development servers**
   ```bash
   # Terminal 1: Backend
   npm run dev
   
   # Terminal 2: Frontend
   cd client
   npm run dev
   ```

The app will be available at `http://localhost:5173` (frontend) and `http://localhost:3000` (backend).

## Usage

### Adding Users to Whitelist

Only whitelisted emails can register. To add users:

**Option 1: Prisma Studio (GUI)**
```bash
DATABASE_URL="your-production-url" npx prisma studio
```
1. Click on `AllowedEmail` table
2. Add record with the user's email
3. Save changes

**Option 2: Seed Script**
Edit `prisma/seed.mjs` and add emails to the array:
```javascript
const allowedEmails = [
  'student1@university.edu',
  'student2@university.edu',
];
```
Then run:
```bash
node prisma/seed.mjs
```

### User Registration Flow

1. User visits the app and clicks "Get Started"
2. Enters email (must be whitelisted)
3. If whitelisted: completes registration with password, year, branch
4. If not whitelisted: receives 403 error (access denied)

### Using the Platform

**Q&A**
- Click "Q&A" in sidebar
- Ask questions (max 5 per hour)
- Answer questions from batchmates
- Upvote/downvote answers
- Mark best answer (question author only)

**Chat**
- Click "Chat" in sidebar
- Send messages to your batch (max 30 per minute)
- Real-time updates via WebSocket
- See typing indicators

**Notes**
- Click "Notes" in sidebar
- View study materials (upload restricted to professors in production)

## Project Structure

```
silo/
├── client/                 # React frontend
│   ├── src/
│   │   ├── features/      # Feature modules (auth, chat, qna, etc.)
│   │   ├── components/    # Reusable UI components
│   │   ├── layouts/       # Page layouts
│   │   ├── stores/        # Zustand state management
│   │   └── lib/           # Utilities and API clients
│   └── public/            # Static assets
├── src/                   # Express backend
│   ├── modules/          # Domain modules
│   │   ├── identity/     # Authentication & authorization
│   │   ├── academic/     # Notes and academic resources
│   │   ├── comm/         # Real-time chat via Socket.io
│   │   └── qna/          # Q&A system (future)
│   └── shared/           # Shared utilities
│       ├── lib/          # Libraries (Prisma, JWT)
│       ├── middleware/   # Express middleware
│       └── types/        # TypeScript type definitions
└── prisma/               # Database schema and migrations
```

## API Documentation

### Authentication
- `POST /auth/register` - Create new account (requires whitelisted email)
- `POST /auth/login` - Login with email/password
- `GET /auth/me` - Get current user profile
- `PUT /auth/me` - Update user profile

### Q&A (Coming Soon)
- `GET /academic/questions` - List questions (batch-scoped)
- `POST /academic/questions` - Create question
- `GET /academic/questions/:id` - Get question details
- `POST /academic/questions/:id/answers` - Answer a question

### Notes
- `GET /academic/notes` - List notes (batch-scoped)
- `POST /academic/notes` - Upload note (professor only)
- `GET /academic/notes/:id` - Get note details

### Chat (Socket.io)
- `connect` - Authenticate and join batch room
- `sendMessage` - Send message to batch
- `getMessages` - Retrieve message history
- `typing` - Send typing indicator

## Deployment

### Backend (Render)
1. Push code to GitHub `main` branch
2. Render auto-deploys from GitHub
3. Environment variables configured in Render dashboard

### Frontend (Vercel)
1. Push code to GitHub `main` branch
2. Vercel auto-deploys from GitHub
3. Environment variables configured in Vercel dashboard

### Database (Neon)
- Serverless PostgreSQL
- Connection pooling enabled
- Automatic backups

## Security Considerations

### Implemented
- Whitelist-based registration (VIP access)
- bcrypt password hashing
- JWT authentication with expiration
- Rate limiting on auth, questions, and chat
- Batch isolation (year + branch scoping)
- Input validation via Zod schemas
- SQL injection prevention (Prisma ORM)
- CORS configuration
- Environment variable protection

### Future Enhancements
- Password reset via email
- Two-factor authentication
- Content moderation tools
- User reporting system
- Admin dashboard
- Email domain verification for professors

## Known Limitations (Beta)

- Professor accounts disabled (students only)
- Notes upload restricted to professors
- No content moderation beyond rate limits
- Manual user management via database
- No email notifications
- Limited to 15 beta users currently

## Contributing

Silo is an open-source project built for students, by students! We welcome contributions from the community. Whether it's fixing bugs, adding new features, or improving documentation, feel free to open issues or submit pull requests.

Please review our [Contributing Guidelines](CONTRIBUTING.md) for details on how to set up the project locally, our code style, and the pull request process.

## License

This project is open-source and licensed under the [MIT License](LICENSE).

## Contact

For support, feature requests, or questions about using Silo, feel free to open an issue in this repository or contact the maintainers at `siloedu00@gmail.com`.

---

**Version**: 1.0.0-beta  
**Last Updated**: February 2026

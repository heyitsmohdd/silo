# Contributing to Silo

Thank you for your interest in contributing to Silo! This document outlines the process for contributing to the project.

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   # Backend
   npm install
   
   # Frontend
   cd client && npm install
   ```
3. Copy `.env.example` to `.env` and configure your local environment
4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. Start development servers:
   ```bash
   # Backend (port 3000)
   npm run dev
   
   # Frontend (port 5173)
   cd client && npm run dev
   ```

## Code Style

- Use TypeScript with strict mode
- Follow the existing code patterns (early returns, descriptive naming)
- No `any` types - always define proper interfaces
- Organize imports properly

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run lint and type checks:
   ```bash
   npm run lint
   npm run typecheck
   ```
5. Commit with clear messages
6. Push to your fork
7. Open a Pull Request

## Reporting Issues

- Use GitHub Issues for bug reports
- Include clear steps to reproduce
- Include relevant environment details

## License

By contributing to Silo, you agree that your contributions will be licensed under the MIT License.

# GitHub Copilot Instructions

This project uses AI-assisted development. Please refer to the main AI guidance document in the repository root:

📋 **[CLAUDE.md](../CLAUDE.md)** - Complete development guide and architecture overview

## Key Points for GitHub Copilot

### Development Commands
- Use `npm run dev:local` for full development (frontend + mock backend)
- Run `npm run lint` to check code quality with Oxlint and Oxfmt
- Use `npm run tsc` for TypeScript type checking

### Architecture Notes
- Real-time data via authenticated WebSocket (`/api/ws`) in `RealtimeContext`, connected by `useRealtime`
- State management with React Context API pattern
- HeroUI components library for UI elements
- Authentication with JWT tokens and auto-refresh

### Code Style
- Follow existing patterns in the codebase
- Use HeroUI components when available
- Maintain TypeScript strict mode compliance
- Follow React hooks best practices

### Testing
- Unit tests with Vitest alongside components
- E2E tests with Playwright in `tests/` directory
- Use `src/utils/test-utils.tsx` for testing utilities

For complete development guidance, architecture details, and workflow instructions, see **CLAUDE.md** in the repository root.

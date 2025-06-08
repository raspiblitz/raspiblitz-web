# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Basic Development
- `npm run dev:local` - Start both frontend and backend mock server concurrently
- `npm run start` or `npm run dev` - Start only frontend development server (port 3000)
- `npm run backend` - Start only backend mock server (port 8000)
- `npm run build` - Create production build
- `npm run tsc` - Run TypeScript type checking

### Testing
- `npm test` - Run unit tests with Vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run coverage` - Generate test coverage report
- `npx playwright test` - Run E2E tests headless
- `npx playwright test --ui` - Run E2E tests with UI

### Code Quality
- `npm run lint` - Lint and format with Biome
- `biome check src --write` - Fix linting issues automatically

## Architecture Overview

### Real-time Data Architecture
This application heavily relies on **Server-Sent Events (SSE)** for real-time updates. The `SSEContext` (`src/context/sse-context.tsx`) manages all real-time data including Bitcoin blockchain info, Lightning network status, wallet balances, and system information. When debugging data issues, check the SSE connection first.

### State Management Pattern
Uses React Context API with a specific provider hierarchy:
```
SSEContextProvider (real-time data)
  └── AppContextProvider (auth + global state)
      └── HeroUIProvider (UI components)
```

The `AppContext` manages authentication state and global preferences, while `SSEContext` handles all real-time Bitcoin/Lightning data.

### Backend Communication
- **Development**: Frontend proxies `/api` requests to mock backend at `http://localhost:8000`
- **Production**: Change `BACKEND_SERVER` in `vite.config.ts` to point to actual RaspiBlitz device
- **Authentication**: JWT tokens with automatic refresh mechanism in `src/App.tsx`

### Key Application Flow
1. **Setup Check**: App checks if device needs initial setup via `/setup/status`
2. **Authentication**: JWT login with automatic token refresh
3. **Real-time Connection**: SSE connection established after login
4. **Route Protection**: All main routes require authentication via `RequireAuth` component

### Component Organization
- **Pages**: Main route components in `src/pages/` (Home, Apps, Settings, Setup)
- **Layouts**: Reusable layout components with navigation
- **Components**: Shared UI components, many using [HeroUI](https://www.heroui.com/docs/guide/introduction) library and icons from the [HeroIcons](https://heroicons.com/) and the [BitcoinIcons](https://bitcoinicons.com/) library
- **Hooks**: Custom hooks for SSE (`useSSE`), modals (`useModalManager`), and utilities

### Development Workflow
When working with real-time features, run `npm run dev:local` to have both frontend and mock backend. The mock backend provides realistic data streams via SSE. For backend changes, edit files in `backend-mock/` - the server restarts automatically.

### Testing Strategy
- **Unit Tests**: Located alongside components in `__tests__/` folders
- **E2E Tests**: In `tests/` directory using Playwright
- **Test Utilities**: Shared testing helpers in `src/utils/test-utils.tsx`

### Internationalization
Uses react-i18next with namespace-based organization. Translation files in `src/i18n/langs/`. The app supports 12+ languages with runtime language switching.

### Common Patterns
- **Modal Management**: Use `useModalManager` hook for consistent modal handling
- **Error Handling**: Global error boundary with toast notifications
- **Loading States**: Skeleton screens for better UX during data loading
- **Form Handling**: React Hook Form for complex forms with validation
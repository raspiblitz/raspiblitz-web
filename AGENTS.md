# AGENTS.md

This file provides guidance to coding agents when working with code in this repository.

## Dependencies and Tooling

- Use npm and keep `package-lock.json` in sync with dependency changes. Install the locked dependencies with `npm ci`.
- Preserve the exact HeroUI and React Aria versions in `package.json` unless the task explicitly includes updating those dependencies. Check their compatibility together when updating them.
- Use Oxlint and Oxfmt through the existing scripts. Both scripts currently operate on `src`.

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
- `npm run lint` - Check source files with Oxlint and Oxfmt
- `npm run format` - Fix lint issues and format source files with Oxlint and Oxfmt

## Validation and Git Workflow

- Before editing, inspect `git status` for existing changes and any merge or rebase in progress. Preserve unrelated changes.
- After code changes, run `npm run lint`, `npm run tsc`, and the relevant tests. Run the full unit suite for changes shared across multiple features.
- After changes to dependencies or build configuration, also run `npm run build`.
- For documentation-only changes, review the diff and run `git diff --check`; application tests are unnecessary.
- When resolving conflicts, preserve the intent of both branches, check for remaining conflict markers, and complete the active merge or rebase after validation.
- In the final report, state what changed, which checks ran, and whether changes are uncommitted, committed locally, or pushed.

## Architecture Overview

### Real-time Data Architecture
This application heavily relies on **Server-Sent Events (SSE)** for real-time updates. The `SSEContext` (`src/context/sse-context.tsx`) manages all real-time data including Bitcoin blockchain info, Lightning network status, wallet balances, and system information. When debugging data issues, check the SSE connection first.

### State Management Pattern
Uses React Context API with a specific provider hierarchy:
```
SSEContextProvider (real-time data)
  └── AppContextProvider (auth + global state)
      └── App
```

The `AppContext` manages authentication state and global preferences, while `SSEContext` handles all real-time Bitcoin/Lightning data.

### Backend Communication
- **API client**: Use the shared Axios `instance` from `src/utils/interceptor.ts`, which uses `/api` as its base URL and attaches the authentication token.
- **Development**: Vite proxies `/api` requests to the backend at `http://localhost:8000`. `BACKEND_SERVER` in `vite.config.ts` controls this development proxy.
- **Production**: The client still requests `/api` on the current origin; deployment routing must make the backend available there.
- **Authentication**: JWT tokens with automatic refresh mechanism in `src/App.tsx`

### API and SSE Contracts

- Validate incoming data before using it. Reuse `src/utils/guards.ts`, `isAppId`, and the parsers in `src/utils/app-state-message.ts` where applicable instead of relying on type assertions.
- Handle malformed events and unknown app IDs without breaking valid updates or rendering unsupported apps.
- App-status timestamps use Unix seconds. Do not substitute `Date.now()` milliseconds without conversion.

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
- Render components through `test-utils` when they need the shared router, contexts, or i18n setup.
- Mock HTTP requests with the existing MSW server in `src/testServer.ts` and register explicit handlers for the requests under test.
- Add focused regression tests for behavior fixes, including relevant error paths. Test observable behavior rather than implementation details.

### Internationalization
Uses react-i18next with namespace-based organization. Translation files in `src/i18n/langs/`. The app supports 12+ languages with runtime language switching.

Use i18n keys for new user-facing text instead of hardcoded strings. Add the corresponding English source text in `src/i18n/langs/en.json` and preserve existing namespaces and interpolation placeholders.

### Common Patterns
- **UI Components**: Reuse existing shared components and HeroUI patterns before introducing new abstractions.
- **Modal Management**: Use `useModalManager` for the Home modal flow and the existing `useOverlayState`/`ConfirmModal` pattern for standalone dialogs.
- **Error Handling**: Global error boundary with toast notifications
- **Loading States**: Skeleton screens for better UX during data loading
- **Form Handling**: React Hook Form for complex forms with validation

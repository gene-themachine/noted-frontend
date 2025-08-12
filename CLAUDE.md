# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
# Install dependencies
npm install

# Run development server (starts on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

## Environment Setup

Create a `.env` file in the root directory with:
```
VITE_API_URL=http://localhost:3333
```

## High-Level Architecture

### Technology Stack
- **Frontend Framework**: React 19.1 with Vite
- **Language**: Mixed JavaScript/TypeScript (migrating to TypeScript)
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: Zustand for global state, TanStack Query for server state
- **Routing**: React Router v7
- **HTTP Client**: Axios with interceptors for auth

### Project Structure

The application is a note-taking and study tool with the following core features:
- **Projects**: Organize notes and resources
- **Notes**: Rich text content with folder hierarchy
- **Flashcards**: Study cards generated from notes
- **Multiple Choice**: Quiz functionality
- **Library**: File storage system

### Key Architectural Patterns

1. **API Layer** (`src/api/`): Centralized API calls with consistent error handling
   - Uses axios interceptors for automatic auth token injection
   - All endpoints return through `handleResponse` and `handleError` utilities

2. **Custom Hooks** (`src/hooks/`): Business logic abstraction using TanStack Query
   - Each feature has dedicated hooks (e.g., `useProjects`, `useNotes`)
   - Handles data fetching, caching, and mutations

3. **Component Organization**:
   - **Screens**: Full page components in `src/screens/`
   - **Components**: Reusable UI components in `src/components/`
   - **Layout**: Shared layout components with nested routing

4. **Routing Structure**:
   - Public routes (auth) wrapped in `PublicRoute`
   - Protected routes use nested layout with project context
   - Project-specific routes: `/project/:projectId/*`

5. **State Management**:
   - Global UI state in Zustand stores (`src/store/`)
   - Server state managed by TanStack Query
   - Local component state with React hooks

6. **Design System** (`src/utils/constants.ts`):
   - Standardized spacing, dimensions, and typography scales
   - Semantic color mapping for consistent theming
   - Responsive breakpoints and layout constants

7. **Authentication**:
   - JWT tokens stored in localStorage
   - Automatic token injection via axios interceptors
   - Token utilities in `src/utils/localStorage.tsx`

## Important Development Notes

- The project uses absolute imports with `@/` alias pointing to `src/`
- Mixed .jsx/.tsx files - prefer TypeScript for new code
- Custom fonts loaded from `/public` directory
- Server runs on `http://localhost:3333` by default
- No TypeScript compilation step - Vite handles TS files directly
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
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

## High-Level Architecture

### Technology Stack

- **Frontend Framework**: React 19.1 with Vite
- **Language**: Mixed JavaScript/TypeScript (migrating to TypeScript)
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: Zustand for global state, TanStack Query for server state
- **Routing**: React Router v7
- **HTTP Client**: Axios with interceptors for auth
- **Auth**: Supabase client for authentication
- **Rich Text Editor**: TipTap (based on ProseMirror)
- **Drag & Drop**: @dnd-kit for tree and sortable interactions

### Project Structure

```
src/
├── api/              # API client layer (Axios calls)
├── hooks/            # TanStack Query hooks for data fetching
├── components/       # Reusable UI components
│   ├── common/       # Shared UI components
│   ├── controller/   # Main app controller/sidebar
│   ├── editor/       # TipTap editor components
│   ├── file-tree/    # Tree navigation components
│   ├── layout/       # Layout components
│   ├── mainWindow/   # Main content area components
│   ├── modals/       # Modal dialogs
│   ├── multipleChoice/ # Multiple choice UI
│   ├── project/      # Project-specific components
│   ├── rightBar/     # Right sidebar components
│   └── ui/           # Basic UI primitives
├── screens/          # Full page components
│   ├── auth/         # Login/signup screens
│   ├── home.tsx      # User home screen
│   ├── library/      # Library management
│   ├── note/         # Note viewing/editing
│   ├── project/      # Project overview
│   ├── studySets/    # Study set screens
│   └── tools/        # Tools screen
├── routes/           # Route configuration
├── store/            # Zustand stores
├── types/            # TypeScript type definitions
├── utils/            # Utility functions and constants
└── lib/              # Third-party library configs (Supabase)
```

### Core Features

The application is a note-taking and study tool with the following features:

1. **Projects** - Organize notes and resources with folder hierarchies
2. **Notes** - Rich text content with TipTap editor
3. **Library** - PDF and file storage with S3 backend
4. **Study Tools**:
   - Flashcards - AI-generated study cards
   - Multiple Choice - Quiz functionality
   - Free Response - Open-ended questions with AI evaluation
   - Q&A - Intelligent question-answering with RAG
5. **Starred Items** - Quick access to important flashcards/questions
6. **Todos** - Task management

### Key Architectural Patterns

#### 1. API Layer (`src/api/`)

Centralized API calls with consistent error handling:

- **Pattern**: Each feature has its own API file (e.g., `project.ts`, `note.ts`)
- **Auth**: Axios interceptors automatically inject Supabase JWT token
- **Error Handling**: `handleResponse` and `handleError` utilities
- **Base URL**: Configured via `VITE_API_URL` environment variable

**Example:**
```typescript
// In src/api/note.ts
export const getNoteById = async (noteId) => {
  const response = await apiClient.get(`/notes/${noteId}`)
  return handleResponse(response)
}
```

#### 2. Custom Hooks (`src/hooks/`)

Business logic abstraction using TanStack Query:

- **Pattern**: Each feature has dedicated hooks (e.g., `useProjects`, `useNotes`)
- **Query Keys**: Consistent naming for cache invalidation
- **Mutations**: Handle create/update/delete with optimistic updates
- **SSE**: Special hooks for Server-Sent Events (e.g., `useQA.ts`)

**Key Hooks:**
- `useProjects.ts` - Project CRUD and tree operations
- `useNotes.ts` - Note CRUD and study options
- `useFlashcard.ts` - Flashcard set management
- `useMultipleChoice.ts` - Multiple choice set management
- `useLibrary.ts` - Library item management
- `useQA.ts` - Q&A with SSE streaming
- `useTodo.ts` - Todo list operations

**Hook Pattern:**
```typescript
export const useProjectNotes = (projectId) => {
  return useQuery({
    queryKey: ['project-notes', projectId],
    queryFn: () => getProjectNotes(projectId),
    enabled: !!projectId,
  })
}

export const useCreateNote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries(['project-notes'])
    },
  })
}
```

#### 3. Component Organization

**Screens** (`src/screens/`) - Full page components:
- Mounted by React Router
- Orchestrate multiple components
- Use custom hooks for data fetching
- Manage page-level state

**Components** (`src/components/`) - Reusable UI:
- Accept props for configuration
- Stateless when possible
- Composed into screens
- Follow single responsibility principle

#### 4. Routing Structure

Using React Router v7 with nested layouts:

```
/ (LandingPage)
/login (SignInPage - Public)
/register (SignUpPage - Public)
/home (Home - with Layout)
/project/:projectId (ProjectLayout)
  ├── / (ProjectScreen)
  ├── /library (LibraryScreen)
  ├── /tools (ToolsMainScreen)
  ├── /note/:noteId (NoteScreen)
  ├── /study-sets/flashcards/:setId (FlashcardSetScreen)
  ├── /study-sets/multiple-choice/:setId (MultipleChoiceSetScreen)
  ├── /study-sets/free-response/:setId (FreeResponseSetScreen)
  └── /starred-flashcards (StarredFlashcardsScreen)
```

**Route Protection:**
- Public routes wrapped in `<PublicRoute>` (redirects if authenticated)
- Protected routes under `<Layout>` (requires authentication)
- Project routes under `<ProjectLayout>` (project context)

#### 5. State Management

**Server State** (TanStack Query):
- All API data (projects, notes, library items, etc.)
- Automatic caching and background refetching
- Optimistic updates for better UX
- Query invalidation on mutations

**Client State** (Zustand):
- UI state (modals, sidebars, selections)
- User preferences
- Transient application state

**Local State** (React hooks):
- Component-specific state
- Form inputs
- Temporary UI state

#### 6. Authentication Flow

Uses Supabase for authentication:

1. User signs in via Supabase client (`src/lib/supabase.ts`)
2. Supabase returns JWT token
3. Token stored in Supabase client (localStorage)
4. Axios interceptor retrieves token from Supabase session
5. Token sent in `Authorization: Bearer <token>` header
6. Backend validates token via JWKS

**Interceptor Setup:**
```typescript
// Token injection happens in axios config
apiClient.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession()
  if (data.session) {
    config.headers.Authorization = `Bearer ${data.session.access_token}`
  }
  return config
})
```

#### 7. Design System (`src/utils/constants.ts`)

Standardized design tokens:

**Spacing**: `SPACING` object with incremental values
**Dimensions**: `DIMENSIONS` for common sizes (header height, sidebar width, etc.)
**Typography**: `TYPOGRAPHY` scales for consistent text sizing
**Colors**: Semantic color mapping (primary, secondary, accent, etc.)
**Routes**: `ROUTES` constants for all application paths

**Usage:**
```jsx
import { SPACING, DIMENSIONS, COLORS } from '@/utils/constants'

<div style={{
  padding: SPACING.md,
  backgroundColor: COLORS.background.primary
}}>
```

#### 8. Real-time Features (SSE)

Server-Sent Events for Q&A streaming:

- EventSource connection in `useQA` hook
- Manual auth via query parameter: `?auth_token=<jwt>`
- Stream parsing for chunked responses
- Auto-reconnection on disconnect
- Proper cleanup on unmount

**Pattern:**
```typescript
// In useQA.ts
const eventSource = new EventSource(
  `${API_URL}/notes/${noteId}/qa/intelligent/stream?auth_token=${token}`
)

eventSource.addEventListener('chunk', (event) => {
  const data = JSON.parse(event.data)
  // Handle streaming chunk
})
```

### Important Implementation Details

#### Import Aliases

Configured in `vite.config.js`:
- `@/*` → `./src/*`

**Usage:**
```typescript
import { ROUTES } from '@/utils/constants'
import { useProjects } from '@/hooks/project'
import Button from '@/components/ui/Button'
```

#### Mixed TypeScript/JavaScript

The codebase is migrating from JavaScript to TypeScript:
- Both `.jsx` and `.tsx` extensions present
- **Prefer TypeScript** for all new code
- Type definitions in `src/types/`
- No compilation step - Vite handles TS directly

#### TipTap Editor

Rich text editing for notes:
- Configured in `src/components/editor/`
- Extensions: StarterKit, Underline
- Custom styling with Tailwind
- Content stored as HTML in database

#### Drag & Drop

Using `@dnd-kit` for interactive UIs:
- File tree reorganization
- Sortable lists
- Touch and keyboard accessible

#### File Uploads

S3-based file uploads:
1. Request presigned URL from API
2. Upload directly to S3 using presigned URL
3. Create library item record via API
4. Vectorization happens automatically in background

### Common Development Scenarios

#### Adding a New API Endpoint Integration

1. **API Client**: Add function in `src/api/<feature>.ts`
2. **Hook**: Create TanStack Query hook in `src/hooks/<feature>.ts`
3. **Component**: Use hook in component
4. **Types**: Add TypeScript types in `src/types/` if needed

#### Creating a New Screen

1. **File**: Create in `src/screens/<feature>/`
2. **Route**: Add route in `src/App.jsx`
3. **Layout**: Choose appropriate layout wrapper
4. **Navigation**: Add link in sidebar/navigation components

#### Adding a New Modal

1. **Component**: Create in `src/components/modals/`
2. **State**: Add Zustand store if complex state needed
3. **Trigger**: Use from parent component
4. **Styling**: Follow existing modal patterns

#### Styling Components

- Use Tailwind CSS utility classes
- Reference design tokens from `constants.ts`
- Maintain consistency with existing components
- Dark mode support (if applicable)

### Development Best Practices

#### Query Key Naming

Be consistent with query keys for cache management:
```typescript
['projects']                          // All projects
['project', projectId]                // Single project
['project-notes', projectId]          // Notes for project
['note', noteId]                      // Single note
['flashcard-sets', projectId]         // Flashcard sets
['study-options', noteId]             // Study options
```

#### Error Handling

- API errors caught by interceptors
- Display user-friendly messages with `react-hot-toast`
- Log errors to console in development
- Graceful degradation for non-critical features

#### Performance

- Use React.memo for expensive components
- Implement pagination for large lists
- Lazy load routes and components when appropriate
- Optimize TanStack Query refetch intervals

#### Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus management in modals

### Project-Specific Notes

#### Folder Hierarchy

Projects have nested folder structures:
- Tree data stored as JSON in backend
- Rendered with recursive components
- Drag-and-drop reorganization
- Context menu for operations

#### Study Set Types

Three types of study sets:
1. **Flashcards** - Front/back card pairs
2. **Multiple Choice** - Questions with options
3. **Free Response** - Open-ended with AI grading

Each has:
- List screen (view all sets)
- Detail screen (view questions)
- Study mode (interactive study interface)

#### Starred vs Regular Sets

- **Regular Sets**: Created from notes/library items
- **Starred Collections**: Curated from individual items across all sets
- Different routes and UI patterns

### Troubleshooting

#### "Cannot connect to API"

- Verify backend is running on port 3333
- Check `VITE_API_URL` in `.env`
- Check browser console for CORS errors
- Verify network requests in DevTools

#### "Authentication failed"

- Check Supabase configuration
- Verify JWT token in Application > Local Storage
- Check token expiration
- Re-login to refresh token

#### "SSE connection failed"

- Verify `auth_token` query parameter
- Check EventSource errors in console
- Ensure backend SSE endpoint is accessible
- Check browser DevTools Network tab

#### Hot reload not working

- Restart dev server
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check Vite config
- Verify file watch limits on system

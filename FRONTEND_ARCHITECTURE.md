# 🎯 Frontend Component Hierarchy & Data Flow

## Component Tree

```
App.jsx (Router)
├── Navbar.jsx
├── Route: /
│   └── Home.jsx
│       ├── Hero Section
│       ├── Features Grid
│       └── CTA Section
├── Route: /auth
│   └── AuthPage.jsx
│       ├── LoginForm.jsx OR RegisterForm.jsx
├── Route: /notes
│   └── NotesPage.jsx
│       ├── Search Input
│       ├── Tag Filters
│       └── NoteList.jsx
│           └── NoteCard.jsx (repeated)
├── Route: /notes/:id
│   └── NoteDetailPage.jsx
│       ├── Note Header (Title, Author, Date)
│       ├── Note Content (Markdown)
│       └── AIGeneratorPanel.jsx
│           ├── SummaryView.jsx (conditional)
│           ├── FlashcardView.jsx (conditional)
│           └── QuizView.jsx (conditional)
├── Route: /create
│   └── ProtectedRoute
│       └── CreateNotePage.jsx
│           ├── Title Input
│           ├── Markdown Editor
│           ├── Tag Input
│           └── Public Toggle
├── Route: /my-notes
│   └── ProtectedRoute
│       └── MyNotesPage.jsx
│           ├── Filter Buttons
│           └── NoteList.jsx
│               └── NoteCard.jsx (repeated)
└── Footer.jsx
```

## Data Flow Diagram

### Authentication Flow
```
User Input (LoginForm/RegisterForm)
    ↓
AuthContext.login() / .register()
    ↓
API: authAPI.login() / .register()
    ↓
axios (adds Authorization header)
    ↓
Backend: POST /api/auth/login | /api/auth/register
    ↓
Response: { token, user }
    ↓
localStorage.setItem('token', 'user')
    ↓
AuthContext state updated
    ↓
Protected Routes now accessible
    ↓
ProtectedRoute component unlocks
```

### Notes List Flow
```
NotesPage.jsx mounts
    ↓
useNotes.fetchAllNotes()
    ↓
API: notesAPI.getAllNotes()
    ↓
axios (GET /api/notes)
    ↓
Backend: SELECT * FROM notes
    ↓
Response: [ { id, title, content, author, tags, ... }, ... ]
    ↓
setNotes(response)
    ↓
render NoteList component
    ↓
NoteList maps notes → NoteCard components
    ↓
Each NoteCard is Link to /notes/:id
```

### AI Generation Flow
```
User opens /notes/:id
    ↓
NoteDetailPage mounts
    ↓
AIGeneratorPanel renders 3 buttons
    ↓
User clicks "Generar Resumen" (example)
    ↓
AIGeneratorPanel.handleGenerate('summary')
    ↓
API: aiAPI.generateSummary(noteId)
    ↓
axios (POST /api/ai/summarize { noteId })
    ↓
Backend: 
  1. Load note content
  2. Check cache (GeneratedContent table)
  3. If cached, return it
  4. If not, call Claude API
  5. Save to cache
  6. Return response
    ↓
Response: { content: "...", type: "summary" }
    ↓
setGeneratedContent(response)
    ↓
setViewType('summary')
    ↓
SummaryView component renders with Markdown
```

## Hooks Dependency Graph

### useAuth()
```
AuthContext
    ↓
useAuth() hook returns:
├── user: {id, name, email}
├── token: "jwt_token_string"
├── isAuthenticated: boolean
├── loading: boolean
├── error: string | null
├── login(credentials) → Promise
├── register(userData) → Promise
└── logout() → void
```

### useNotes()
```
State:
├── notes: array
├── loading: boolean
├── error: string | null

Methods:
├── fetchAllNotes(params) → uses notesAPI.getAllNotes()
├── fetchNoteById(id) → uses notesAPI.getNoteById()
├── fetchUserNotes(userId, params) → uses notesAPI.getNotesByUserId()
├── createNote(data) → uses notesAPI.createNote()
├── updateNote(id, data) → uses notesAPI.updateNote()
└── deleteNote(id) → uses notesAPI.deleteNote()
```

## API Layer Structure

### Axios Configuration (axios.js)
```
api instance
├── baseURL: "http://localhost:5000/api"
├── headers: { "Content-Type": "application/json" }
├── Request Interceptor:
│   └── Add Authorization: "Bearer {token}"
└── Response Interceptor:
    └── Handle 401 → clear localStorage + redirect
```

### Auth API (auth.js)
```
authAPI {
├── register(userData) → POST /auth/register
├── login(credentials) → POST /auth/login
└── getCurrentUser() → GET /auth/me
}
```

### Notes API (notes.js)
```
notesAPI {
├── getAllNotes(params) → GET /notes
├── getNoteById(id) → GET /notes/:id
├── getNotesByUserId(userId, params) → GET /notes/user/:userId
├── createNote(data) → POST /notes
├── updateNote(id, data) → PUT /notes/:id
└── deleteNote(id) → DELETE /notes/:id
}
```

### AI API (ai.js)
```
aiAPI {
├── generateSummary(noteId) → POST /ai/summarize
├── generateFlashcards(noteId) → POST /ai/flashcards
├── generateQuiz(noteId) → POST /ai/quiz
├── getHistory(noteId) → GET /ai/history/:noteId
└── deleteContent(id) → DELETE /ai/:id
}
```

## Component Communication Patterns

### Context (Global State)
```
AuthContext provides:
├── User state across all components
├── Token management
└── Login/Logout functions

Accessed via useAuth() hook in any component
```

### Props Drilling (Parent → Child)
```
NotesPage
├── notes (Array)
├── loading (Boolean)
└── error (String)
    ↓ passed as props
NoteList
└── maps notes to
    NoteCard
    ├── note prop
    └── renders Link to detail page
```

### State Callbacks
```
NoteDetailPage
    ↓ passes callback
AIGeneratorPanel
    ├── onGenerated callback
    └── calls onGenerated({ type, content })
        ↓ parent updates
        setGeneratedContent()
        setViewType()
        ↓ conditional render
        SummaryView / FlashcardView / QuizView
```

## localStorage Schema

### Stored Data
```
localStorage {
├── token: "eyJhbGciOiJIUzI1NiIs..."
├── user: "{\"id\":1,\"name\":\"John\",\"email\":\"john@example.com\"}"
}
```

### Lifecycle
```
1. User registers/logs in
   └── Save token + user to localStorage

2. App loads
   └── Check localStorage for token + user
   └── Initialize AuthContext with saved data
   └── Update axios authorization header

3. Unauthorized (401)
   └── Response interceptor clears localStorage
   └── Redirect to /auth

4. User logs out
   └── Call logout()
   └── Clear localStorage
   └── Clear AuthContext
   └── AuthContext prevents access to protected routes
```

## Error Handling Flow

### Form Validation
```
User submits form
    ↓
validateForm() runs client-side
    ↓
If errors → setValidationErrors()
    ↓
Display error messages in UI
    ↓
User cannot submit form
```

### API Error Handling
```
API call made (Promise)
    ↓
catch (error) block
    ↓
Check error type:
├── 401 Unauthorized → Interceptor handles
├── Network Error → Error message
└── Other → Generic error message
    ↓
setError(errorMessage)
    ↓
Display in error container
    ↓
User sees what went wrong
```

## Responsive Design Breakpoints

### Tailwind Breakpoints Used
```
Mobile (default)
├── NoteList: 1 column
├── Navbar: hamburger menu
└── Forms: full width

md: (768px) Tablet
├── NoteList: 2 columns
├── Navbar: full menu
└── Flex layouts start

lg: (1024px) Desktop
├── NoteList: 3 columns
├── Grid layouts activate
└── Sidebar appears
```

---

This architecture ensures **scalability**, **maintainability**, and **clean data flow** throughout the application.

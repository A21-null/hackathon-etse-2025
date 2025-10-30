# 🚀 Frontend Quick Start Guide

## What Was Built

A complete **React + Vite + Tailwind** frontend for StudyFlow with:
- ✅ 7 full pages with routing
- ✅ Authentication (login/register)
- ✅ Notes management (CRUD)
- ✅ AI content generation (Summary, Flashcards, Quiz)
- ✅ Responsive design
- ✅ Error handling & validation

## Installation (2 minutes)

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Browser opens automatically at **http://localhost:5173**

## What You Get

### Pages Available

| Feature | URL | Auth? |
|---------|-----|-------|
| 🏠 Home | `/` | No |
| 📝 Browse Notes | `/notes` | No |
| 👁️ Note Detail + AI | `/notes/:id` | No |
| 🔐 Login/Register | `/auth` | No |
| ✏️ Create Note | `/create` | **Yes** |
| 📚 My Notes | `/my-notes` | **Yes** |

### Key Features

1. **Create Account** → Click "Inicia Sesión" button
2. **Create Apunte** → Click "Nuevo Apunte" (logged in only)
3. **Generate AI Content** → Open apunte → Pick Summary/Flashcards/Quiz
4. **Flashcards** → Click card to flip, navigate with buttons
5. **Quiz** → Answer questions, get instant feedback

## Dependencies Already Installed

```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.21.1",
  "axios": "^1.6.5",
  "react-markdown": "^9.0.1",
  "lucide-react": "^0.309.0",
  "tailwindcss": "^3.4.1"
}
```

## Important Notes

⚠️ **Backend Required**: This frontend needs the backend running on `http://localhost:5000`

### Environment
The `.env.example` already has the correct backend URL:
```
VITE_API_URL=http://localhost:5000/api
```

## Project Structure

```
src/
├── pages/           ← 6 page components
├── components/      ← 16 reusable components
├── hooks/           ← useAuth, useNotes
├── context/         ← AuthContext
├── api/             ← API clients
└── styles/          ← Tailwind + custom CSS
```

## Common Tasks

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## Troubleshooting

### Port 5173 already in use?
```bash
npm run dev -- --port 5174
```

### Backend not connected?
1. Check backend is running: `http://localhost:5000/api`
2. Verify `VITE_API_URL` in `.env`
3. Check browser console for errors

### Styles not loading?
```bash
npm install  # Reinstall dependencies
npm run dev  # Restart dev server
```

## File Organization

**Pages** (User-facing)
- `Home.jsx` - Landing page
- `AuthPage.jsx` - Login/Register form selector
- `NotesPage.jsx` - Public notes grid
- `NoteDetailPage.jsx` - Single note + AI generator
- `CreateNotePage.jsx` - Create note form
- `MyNotesPage.jsx` - Personal notes collection

**Components** (Reusable)
- `layout/` - Navbar, Footer
- `auth/` - LoginForm, RegisterForm
- `notes/` - NoteCard, NoteList
- `ai/` - AIGeneratorPanel, SummaryView, FlashcardView, QuizView

**Utilities**
- `hooks/` - useAuth, useNotes
- `context/` - AuthContext
- `api/` - axios, auth, notes, ai
- `styles/` - index.css with Tailwind

## Next Steps

1. ✅ Install and run `npm install && npm run dev`
2. 🧪 Test auth: Register a new account
3. 📝 Create an apunte with some markdown
4. 🤖 Try AI features (needs backend)
5. 🎨 Customize styles in `tailwind.config.js`

---

**Everything is ready. Just run `npm install && npm run dev` 🚀**

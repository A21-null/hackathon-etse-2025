# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**StudyFlow** is an AI-powered study notes sharing platform built for a hackathon. Users can create, share, and discover study notes, with AI-generated summaries, flashcards, and quizzes powered by Claude API.

**Constraints:**
- Budget: $40 USD API usage limit
- Duration: 8 hours hackathon
- Status: Backend 100% complete, Frontend implemented

## Architecture

### Tech Stack
- **Backend:** Node.js v18+ with Express, ES modules (`"type": "module"`)
- **Database:** PostgreSQL 15 with Sequelize ORM
- **Frontend:** React 18 + Vite + React Router + Tailwind CSS
- **AI:** Anthropic Claude API (Haiku for summaries, Sonnet 3.5 for flashcards/quiz)
- **Auth:** JWT tokens with bcrypt password hashing
- **DevOps:** Docker Compose for local PostgreSQL + pgAdmin

### Project Structure
```
equipo-3/
├── backend/
│   ├── server.js                    # Express server entry point
│   ├── package.json                 # ES modules enabled
│   ├── .env                         # Environment variables (gitignored)
│   └── src/
│       ├── config/                  # Database, JWT, Claude config
│       ├── models/                  # Sequelize models (User, Note, GeneratedContent)
│       ├── controllers/             # Business logic (auth, notes, ai)
│       ├── routes/                  # Express routes
│       ├── middleware/              # Auth, validation, error handling
│       ├── services/                # External services (Claude API)
│       └── utils/                   # Prompt templates
├── frontend/
│   ├── src/
│   │   ├── pages/                   # Route pages
│   │   ├── components/              # Reusable UI components
│   │   ├── context/                 # React Context (AuthContext)
│   │   ├── hooks/                   # Custom React hooks
│   │   └── api/                     # Axios API client
│   └── package.json
└── docker-compose.yml               # PostgreSQL + pgAdmin services
```

### Data Models & Relationships
- **User** (1:N) **Note** - Users create notes
- **Note** (1:N) **GeneratedContent** - Notes have AI-generated content

**Key Model Fields:**
- `Note`: `tags` (array), `isPublic` (boolean), `authorId` (FK)
- `GeneratedContent`: `type` ('summary'|'flashcards'|'quiz'), `content` (JSONB)

**Database Indices:**
- `notes.tags` - GIN index for array search
- `generated_contents.content` - GIN index for JSONB search
- `notes.author_id` - B-tree for foreign key lookups

### AI Cost Optimization Strategy
The system uses **dual-model optimization** to maximize the $40 budget:
- **Claude 3 Haiku** (`claude-3-haiku-20240307`) for summaries - fast and economical
- **Claude 3.5 Sonnet** (`claude-3-5-sonnet-20241022`) for flashcards/quiz - more capable
- **Caching system** in PostgreSQL - checks for existing AI content before API calls
- Model selection in `backend/src/services/claude.service.js:18-25`

## Common Commands

### Initial Setup
```bash
# Prerequisites: Node.js v18+, Docker, Docker Compose

# 1. Activate Node.js v18 (if using nvm)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 18

# 2. Install backend dependencies
cd backend
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env and add CLAUDE_API_KEY and JWT_SECRET

# 4. Start PostgreSQL + pgAdmin
cd ..
docker-compose up -d

# 5. Create database tables
cd backend
npm run db:sync
```

### Development

**Backend:**
```bash
cd backend
npm run dev          # Start with nodemon (hot-reload)
npm start            # Start in production mode
npm run db:sync      # Sync database schema (safe, keeps data)
npm run db:reset     # Reset database (DANGER: deletes all data)
```

**Frontend:**
```bash
cd frontend
npm install          # Install dependencies (first time)
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

**Docker:**
```bash
docker-compose up -d       # Start PostgreSQL + pgAdmin
docker-compose ps          # Check service status
docker-compose logs -f     # View logs
docker-compose down        # Stop services (keeps data)
docker-compose down -v     # Stop and delete volumes (DANGER: loses data)
```

**Database Access:**
```bash
# Via psql in Docker container
docker-compose exec postgres psql -U admin -d studyflow

# Via pgAdmin web UI
# Open http://localhost:5050
# Login: admin@studyflow.com / admin
# Add server: host=postgres, port=5432, user=admin, password=password123
```

### Testing & Verification
```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"pass123"}'

# Login (returns JWT token)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'

# Create note (requires token)
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Test Note","content":"Content here...","tags":["test"],"isPublic":true}'

# Generate AI summary
curl -X POST http://localhost:5000/api/ai/summarize \
  -H "Content-Type: application/json" \
  -d '{"noteId":1}'
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register user → returns `{user, token}`
- `POST /login` - Login → returns `{user, token}`
- `GET /me` - Get current user [Protected]

### Notes (`/api/notes`)
- `GET /` - List public notes (query: `?page=1&limit=20&search=term&tags=tag1,tag2`)
- `GET /:id` - Get note by ID
- `GET /user/:userId` - Get user's notes
- `POST /` - Create note [Protected]
- `PUT /:id` - Update note [Protected, owner only]
- `DELETE /:id` - Delete note [Protected, owner only]

### AI Generation (`/api/ai`)
- `POST /summarize` - Generate summary (uses Haiku) → `{noteId}`
- `POST /flashcards` - Generate flashcards (uses Sonnet 3.5) → `{noteId}`
- `POST /quiz` - Generate quiz (uses Sonnet 3.5) → `{noteId}`
- `GET /history/:noteId` - Get generation history
- `DELETE /:id` - Delete generated content [Protected, note owner only]

**Note:** AI endpoints check cache first, only call Claude API if no existing content.

## Environment Variables

### Backend `.env` (required)
```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=studyflow
DB_USER=admin
DB_PASSWORD=password123

# JWT
JWT_SECRET=your-secret-here  # Generate: openssl rand -base64 32
JWT_EXPIRES_IN=7d

# Claude API
CLAUDE_API_KEY=sk-ant-api03-...  # From https://console.anthropic.com

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env` (optional)
```bash
VITE_API_URL=http://localhost:5000
```

## Key Implementation Details

### Authentication Flow
1. User registers/logs in → JWT token issued (7-day expiry)
2. Token stored in localStorage (frontend) via `AuthContext`
3. Protected routes use `auth.middleware.js` to verify JWT
4. Token sent as `Authorization: Bearer <token>` header

### AI Content Generation Flow
1. Frontend calls `/api/ai/summarize|flashcards|quiz` with `noteId`
2. Controller checks `GeneratedContent` table for existing content of that type
3. If exists → return cached content (instant, $0 cost)
4. If not exists → call Claude API with prompt from `utils/prompts.js`
5. Store result in `GeneratedContent` table
6. Return to frontend

### Model Selection Logic (in `claude.service.js`)
```javascript
const model = contentType === 'summary'
  ? 'claude-3-haiku-20240307'      // Fast & cheap for summaries
  : 'claude-3-5-sonnet-20241022';   // Powerful for structured content
```

### Frontend Routing
- `/` - Home page (landing)
- `/auth` - Login/Register page
- `/notes` - Browse public notes
- `/notes/:id` - View note detail + AI tools
- `/create` - Create note [Protected]
- `/my-notes` - User's notes [Protected]

### State Management
- **Global auth state:** `AuthContext` (user, token, login/logout functions)
- **Local data fetching:** Custom hooks (`useNotes`, `useAuth`)
- **API client:** Axios instance with base URL and token interceptor

## Troubleshooting

### "Cannot connect to PostgreSQL"
```bash
# Check Docker is running
docker ps

# Restart PostgreSQL
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

### "Port 5432 already in use"
Local PostgreSQL is running. Options:
1. Stop local: `sudo service postgresql stop`
2. Change port in `docker-compose.yml` and `.env`: `DB_PORT=5433`

### "CLAUDE_API_KEY is not defined"
1. Ensure `backend/.env` exists (copy from `.env.example`)
2. Add valid Claude API key from https://console.anthropic.com

### "Module not found" errors
Backend uses ES modules. Ensure:
- `package.json` has `"type": "module"`
- All imports use `.js` extension: `import foo from './foo.js'`
- Use `import` not `require()`

### Node.js version issues
This project requires Node.js v18+. Update if needed:
```bash
nvm install 18
nvm use 18
node --version  # Should show v18.x.x
```

## Security Notes

- **API keys:** Never commit `.env` file (in `.gitignore`)
- **Passwords:** Hashed with bcrypt (10 rounds)
- **JWT:** Uses `JWT_SECRET` from environment, 7-day expiry
- **Authorization:** Routes check both authentication AND ownership before edit/delete
- **Input validation:** `express-validator` on all endpoints
- **SQL injection:** Protected by Sequelize ORM parameterization
- **CORS:** Configured for frontend URL only

## Documentation Files

- `README_FINAL.md` - Complete project summary
- `SETUP_INSTRUCTIONS.md` - Detailed setup guide
- `backend/README.md` - Backend documentation
- `backend/STATUS.md` - Development status
- `backend/QUICK_START.md` - Quick start commands
- `INFORME_SEGURIDAD_RENDIMIENTO.md` - Security & performance audit
- `FRONTEND_GUIDE.md` - Frontend architecture guide

## Production Deployment Checklist

Before deploying:
- [ ] Generate new `JWT_SECRET` (don't use dev secret)
- [ ] Set `NODE_ENV=production`
- [ ] Configure production PostgreSQL (Railway, Supabase, etc.)
- [ ] Set `FRONTEND_URL` to production frontend URL
- [ ] Enable HTTPS/SSL
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure environment variables in hosting platform
- [ ] Test all endpoints in production environment

## Budget Monitoring

Track API usage at: https://console.anthropic.com/

**Estimated capacity with $40 budget:**
- ~43,000 requests with model mix (50% Haiku, 50% Sonnet)
- ~6,600 requests with Sonnet only
- Caching system can increase effective capacity significantly

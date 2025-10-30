# 🚀 StudyFlow - Complete Launch Guide

**Complete step-by-step guide to launch the StudyFlow application from scratch**

---

## 📋 Table of Contents

1. [Quick Start (5 minutes)](#quick-start-5-minutes)
2. [Prerequisites](#prerequisites)
3. [Detailed Setup Guide](#detailed-setup-guide)
4. [Configuration](#configuration)
5. [Launching the Application](#launching-the-application)
6. [Testing the Application](#testing-the-application)
7. [Production Deployment](#production-deployment)
8. [Troubleshooting](#troubleshooting)

---

## ⚡ Quick Start (5 minutes)

**For experienced developers who want to get started immediately:**

```bash
# 1. Clone and navigate to the project
cd equipo-3

# 2. Configure environment variables
cp backend/.env.example backend/.env
# Edit backend/.env and add your CLAUDE_API_KEY

cp frontend/.env.example frontend/.env
# (Frontend .env is already configured for local development)

# 3. Launch everything with one command
./start.sh
```

That's it! The application will be running at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

---

## 📦 Prerequisites

### Required Software

| Software | Version | Purpose | Download |
|----------|---------|---------|----------|
| **Node.js** | v18+ | JavaScript runtime | [nodejs.org](https://nodejs.org/) |
| **npm** | v9+ | Package manager | Included with Node.js |
| **Docker** | Latest | Container platform | [docs.docker.com](https://docs.docker.com/get-docker/) |
| **Docker Compose** | Latest | Multi-container orchestration | Included with Docker Desktop |
| **Git** | Latest | Version control | [git-scm.com](https://git-scm.com/) |

### Verify Installation

```bash
node --version    # Should be v18.x.x or higher
npm --version     # Should be 9.x.x or higher
docker --version  # Should show Docker version
docker-compose --version  # Should show docker-compose version
```

### Get Claude API Key

1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to "API Keys"
4. Create a new API key
5. Copy the key (starts with `sk-ant-api03-...`)

**Budget**: The project is optimized for a $40 USD budget (~43,000 requests with mixed models)

---

## 🔧 Detailed Setup Guide

### Step 1: Project Setup

```bash
# Navigate to the project directory
cd /home/mpereiroc/Documentos/equipo-3

# Or if you're cloning from Git:
# git clone <repository-url>
# cd equipo-3
```

### Step 2: Backend Configuration

```bash
# Copy the environment template
cp backend/.env.example backend/.env

# Edit the .env file
nano backend/.env  # or use your preferred editor
```

**Configure these variables in `backend/.env`:**

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# PostgreSQL Database (Default values work with docker-compose)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=studyflow
DB_USER=admin
DB_PASSWORD=password123

# JWT Secret (Generate a new one for production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
# Generate with: openssl rand -base64 32
JWT_EXPIRES_IN=7d

# Claude API (REQUIRED - Get from console.anthropic.com)
CLAUDE_API_KEY=sk-ant-api03-YOUR-KEY-HERE

# CORS (Frontend URLs)
FRONTEND_URL=http://localhost:5173
```

### Step 3: Frontend Configuration

```bash
# Copy the environment template
cp frontend/.env.example frontend/.env

# The default configuration works for local development
# No editing needed unless you change ports
```

**Default `frontend/.env`:**

```bash
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Install Dependencies

**Backend:**
```bash
cd backend
npm install
cd ..
```

**Frontend:**
```bash
cd frontend
npm install
cd ..
```

This will install:
- **Backend**: ~220 packages (Express, Sequelize, bcrypt, JWT, Claude SDK, etc.)
- **Frontend**: ~300 packages (React, Vite, Tailwind, Axios, etc.)

---

## 🚀 Launching the Application

### Method 1: Automated Launch (Recommended)

Use the provided startup script that handles everything:

```bash
./start.sh
```

This script will:
1. ✅ Check all prerequisites
2. ✅ Verify environment files
3. ✅ Install dependencies
4. ✅ Start PostgreSQL with Docker
5. ✅ Initialize the database
6. ✅ Start the backend server
7. ✅ Start the frontend server

**Output when successful:**

```
============================================
  ✅ StudyFlow is now running!
============================================

📡 Services:
   • Frontend:  http://localhost:5173
   • Backend:   http://localhost:5000
   • API Docs:  http://localhost:5000/health
   • pgAdmin:   http://localhost:5050
```

### Method 2: Manual Launch

If you prefer to start services individually:

**1. Start PostgreSQL:**
```bash
docker-compose up -d
```

**2. Initialize Database:**
```bash
cd backend
npm run db:sync
cd ..
```

**3. Start Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**4. Start Frontend (in a new terminal):**
```bash
cd frontend
npm run dev
# Server runs on http://localhost:5173
```

---

## 🛑 Stopping the Application

### Automated Stop

```bash
./stop.sh
```

This will:
- Stop the frontend server
- Stop the backend server
- Stop PostgreSQL containers

### Manual Stop

```bash
# Stop frontend and backend (Ctrl+C in their terminals)

# Stop PostgreSQL
docker-compose down
```

---

## 🧪 Testing the Application

### 1. Health Check

Verify the backend is running:

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-30T...",
  "uptime": 5.123,
  "environment": "development"
}
```

### 2. Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@studyflow.com",
    "password": "password123"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "Test User",
      "email": "test@studyflow.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Save the token** for authenticated requests!

### 3. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@studyflow.com",
    "password": "password123"
  }'
```

### 4. Create a Note

```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Introduction to Quantum Physics",
    "content": "Quantum mechanics is a fundamental theory in physics that describes the physical properties of nature at the scale of atoms and subatomic particles. Key concepts include wave-particle duality, the uncertainty principle, and quantum entanglement. The Schrödinger equation is the fundamental equation of quantum mechanics.",
    "tags": ["physics", "quantum", "science"],
    "isPublic": true
  }'
```

### 5. Generate AI Content

**Summary:**
```bash
curl -X POST http://localhost:5000/api/ai/summarize \
  -H "Content-Type: application/json" \
  -d '{"noteId": 1}'
```

**Flashcards:**
```bash
curl -X POST http://localhost:5000/api/ai/flashcards \
  -H "Content-Type: application/json" \
  -d '{"noteId": 1}'
```

**Quiz:**
```bash
curl -X POST http://localhost:5000/api/ai/quiz \
  -H "Content-Type: application/json" \
  -d '{"noteId": 1}'
```

### 6. Test the Frontend

1. Open http://localhost:5173 in your browser
2. Click "Iniciar Sesión" (Login)
3. Register a new account or login
4. Create a new note
5. View the note and generate AI content
6. Test flashcards and quiz features

---

## 🌐 Production Deployment

### Backend Deployment

**Recommended Platforms:**
- Railway (https://railway.app/)
- Render (https://render.com/)
- Heroku (https://heroku.com/)
- DigitalOcean App Platform

**Steps for Railway:**

1. Create a new project on Railway
2. Add PostgreSQL database
3. Deploy backend from GitHub
4. Set environment variables:
   ```
   NODE_ENV=production
   PORT=5000
   DB_HOST=[railway-postgres-host]
   DB_PORT=5432
   DB_NAME=railway
   DB_USER=[railway-user]
   DB_PASSWORD=[railway-password]
   JWT_SECRET=[generate-new-secret]
   CLAUDE_API_KEY=[your-api-key]
   FRONTEND_URL=[your-frontend-url]
   PRODUCTION_FRONTEND_URL=[your-frontend-url]
   ```
5. Deploy!

### Frontend Deployment

**Recommended Platforms:**
- Vercel (https://vercel.com/) - Best for Vite/React
- Netlify (https://netlify.com/)

**Steps for Vercel:**

1. Connect your GitHub repository
2. Framework: Vite
3. Root directory: `frontend`
4. Build command: `npm run build`
5. Output directory: `dist`
6. Environment variable:
   ```
   VITE_API_URL=https://your-backend-domain.com/api
   ```
7. Deploy!

### Database Migration

For production, use proper migrations instead of `sync()`:

```bash
# In backend/
npm install --save-dev sequelize-cli

# Initialize migrations
npx sequelize-cli init

# Create migration
npx sequelize-cli migration:generate --name create-initial-tables

# Run migrations
npx sequelize-cli db:migrate
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Port 5432 already in use"

**Problem**: PostgreSQL is already running on your system

**Solution A**: Stop local PostgreSQL
```bash
sudo service postgresql stop
```

**Solution B**: Change the port in `docker-compose.yml` and `backend/.env`
```yaml
# docker-compose.yml
ports:
  - "5433:5432"
```
```bash
# backend/.env
DB_PORT=5433
```

#### 2. "Port 5000 already in use"

**Problem**: Another service is using port 5000

**Solution**: Kill the process or change the port
```bash
# Find and kill the process
lsof -ti:5000 | xargs kill

# Or change the port in backend/.env
PORT=5001
```

#### 3. "CLAUDE_API_KEY is not defined"

**Problem**: Missing or invalid API key

**Solution**:
1. Check `backend/.env` exists
2. Verify the API key is correct (starts with `sk-ant-api03-`)
3. Get a new key from https://console.anthropic.com/

#### 4. "Cannot connect to PostgreSQL"

**Problem**: Docker container not running

**Solution**:
```bash
# Check Docker is running
docker ps

# Restart containers
docker-compose down
docker-compose up -d

# Check logs
docker-compose logs postgres
```

#### 5. "Module not found" errors

**Problem**: Dependencies not installed

**Solution**:
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### 6. Frontend can't connect to backend

**Problem**: CORS or wrong API URL

**Solution**:
1. Verify backend is running: `curl http://localhost:5000/health`
2. Check `frontend/.env` has correct `VITE_API_URL`
3. Restart frontend after changing .env
4. Check browser console for CORS errors

#### 7. Node.js version too old

**Problem**: Need Node.js v18+

**Solution**:
```bash
# Install NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js 18
nvm install 18
nvm use 18
nvm alias default 18

# Verify
node --version  # Should show v18.x.x
```

### Getting Help

1. **Check logs**:
   ```bash
   # Backend log
   tail -f backend.log

   # Frontend log
   tail -f frontend.log

   # PostgreSQL logs
   docker-compose logs postgres
   ```

2. **Database inspection**:
   - Open pgAdmin: http://localhost:5050
   - Login: admin@studyflow.com / admin
   - Connect to database and inspect tables

3. **Check documentation**:
   - `README_FINAL.md` - Project overview
   - `CLAUDE.md` - Architecture details
   - `backend/README.md` - Backend specific
   - `FRONTEND_GUIDE.md` - Frontend specific

---

## 📊 Services Overview

| Service | URL | Purpose | Credentials |
|---------|-----|---------|-------------|
| **Frontend** | http://localhost:5173 | React UI | - |
| **Backend** | http://localhost:5000 | REST API | - |
| **Health Check** | http://localhost:5000/health | Status endpoint | - |
| **PostgreSQL** | localhost:5432 | Database | admin / password123 |
| **pgAdmin** | http://localhost:5050 | DB Admin UI | admin@studyflow.com / admin |

---

## 🎯 Features Checklist

After launching, you should be able to:

- ✅ Register new users
- ✅ Login with JWT authentication
- ✅ Create public/private notes
- ✅ Search and filter notes by tags
- ✅ View note details
- ✅ Edit own notes
- ✅ Delete own notes
- ✅ Generate AI summaries (Claude Haiku - fast & cheap)
- ✅ Generate flashcards (Claude Sonnet 3.5 - powerful)
- ✅ Generate quizzes (Claude Sonnet 3.5 - powerful)
- ✅ Interactive flashcard flipping
- ✅ Quiz with instant feedback
- ✅ Responsive design (mobile, tablet, desktop)

---

## 💰 Cost Monitoring

**Budget**: $40 USD for Claude API

**Monitor usage**:
1. Go to https://console.anthropic.com/
2. Check "Usage" dashboard
3. Track spending in real-time

**Cost optimization features**:
- ✅ Caching system (saves 100% on regenerations)
- ✅ Dual-model strategy (Haiku for summaries, Sonnet for complex tasks)
- ✅ Input validation (max 50k chars per note)
- ✅ Efficient prompts

**Expected capacity**:
- ~43,000 requests with model mix
- ~6,600 requests with Sonnet only
- Caching can 2-5x effective capacity

---

## 🎉 Success!

If you see this, you're ready to go:

```
============================================
  ✅ StudyFlow is now running!
============================================

📡 Services:
   • Frontend:  http://localhost:5173
   • Backend:   http://localhost:5000
   • API Docs:  http://localhost:5000/health
   • pgAdmin:   http://localhost:5050
```

**Next steps**:
1. Open http://localhost:5173
2. Create an account
3. Create your first note
4. Generate AI content
5. Start studying! 📚

---

## 📞 Support

- **Documentation**: See all `.md` files in project root
- **Issues**: Check the troubleshooting section above
- **Logs**: `backend.log` and `frontend.log`
- **Database**: Use pgAdmin at http://localhost:5050

---

**Made with ❤️ by Equipo 3**

*Last updated: October 30, 2025*

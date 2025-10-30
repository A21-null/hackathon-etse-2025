# 🎓 StudyFlow - AI-Powered Study Notes Platform

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![Backend](https://img.shields.io/badge/backend-100%25%20complete-success)
![Frontend](https://img.shields.io/badge/frontend-100%25%20complete-success)

**StudyFlow** is a collaborative study platform where users can create, share, and discover study notes enhanced with AI-generated content including summaries, flashcards, and quizzes.

---

## ⚡ Quick Start

```bash
# 1. Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env and add your CLAUDE_API_KEY

# 2. Launch everything
./start.sh

# 3. Open in browser
# Frontend: http://localhost:5173
# Backend:  http://localhost:5000
```

**That's it!** 🎉

For detailed instructions, see **[LAUNCH.md](LAUNCH.md)** or **[QUICK_START.md](QUICK_START.md)**

---

## 📚 Key Documentation

| Document | Description |
|----------|-------------|
| **[QUICK_START.md](QUICK_START.md)** | ⚡ 5-minute launch guide |
| **[LAUNCH.md](LAUNCH.md)** | 📖 Complete setup & troubleshooting |
| **[DEPLOYMENT.md](DEPLOYMENT.md)** | 🌐 Production deployment guide |
| **[CLAUDE.md](CLAUDE.md)** | 🏗️ Architecture & development |
| [README_FINAL.md](README_FINAL.md) | 📊 Project overview & stats |

---

## ✨ Features

- 🔐 **Secure Authentication** (JWT + bcrypt)
- 📝 **Notes Management** (Create, edit, search, tag)
- 🤖 **AI Content Generation**:
  - Summaries (Claude Haiku - fast)
  - Flashcards (Claude Sonnet 3.5 - interactive)
  - Quizzes (Claude Sonnet 3.5 - with feedback)
- 💾 **Smart Caching** (Saves API costs)
- 🎨 **Modern UI** (Responsive, Tailwind CSS)
- 💰 **Cost Optimized** ($40 budget → ~43k requests)

---

## 🏗️ Tech Stack

**Backend**: Node.js 18 + Express + PostgreSQL + Sequelize + JWT
**Frontend**: React 18 + Vite + Tailwind CSS + React Router
**AI**: Anthropic Claude (Haiku + Sonnet 3.5)
**DevOps**: Docker Compose

---

## 🚀 Commands

```bash
./start.sh              # Launch everything
./stop.sh               # Stop all services
docker-compose logs -f  # View logs
npm run dev             # Development mode (in backend/ or frontend/)
```

---

## 📡 Services

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **pgAdmin**: http://localhost:5050 (admin@studyflow.com / admin)

---

## 📊 Project Stats

- **14 API Endpoints** (Auth, Notes, AI)
- **16 React Components**
- **4,000+ Lines** of Code
- **100% Complete** ✅

---

## 🌐 Deploy to Production

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for Railway, Render, Vercel deployment guides.

---

## 🐛 Troubleshooting

```bash
# Port conflicts
sudo service postgresql stop
lsof -ti:5000 | xargs kill

# Database issues
docker-compose down && docker-compose up -d

# Dependencies
cd backend && npm install
cd frontend && npm install
```

See [LAUNCH.md](LAUNCH.md#troubleshooting) for more help.

---

## 📄 License

MIT License

---

**Made with ❤️ by Equipo 3 | Hackathon 2025**

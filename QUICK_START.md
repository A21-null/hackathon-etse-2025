# ⚡ Quick Start Guide

Get StudyFlow running in **5 minutes**!

---

## 🎯 One-Command Launch

```bash
./start.sh
```

**That's literally it!** 🎉

The script will:
- ✅ Check prerequisites (Node.js, Docker)
- ✅ Install dependencies
- ✅ Start PostgreSQL
- ✅ Initialize database
- ✅ Start backend
- ✅ Start frontend

---

## 📋 Before You Start

### 1. Get Claude API Key (2 minutes)

1. Go to https://console.anthropic.com/
2. Sign up/login
3. Go to "API Keys"
4. Create new key
5. Copy the key (starts with `sk-ant-api03-...`)

### 2. Configure API Key (1 minute)

```bash
# Copy template
cp backend/.env.example backend/.env

# Edit file
nano backend/.env  # or use any editor

# Add your key
CLAUDE_API_KEY=sk-ant-api03-YOUR-KEY-HERE
```

### 3. Launch (2 minutes)

```bash
./start.sh
```

Wait for this message:
```
============================================
  ✅ StudyFlow is now running!
============================================

📡 Services:
   • Frontend:  http://localhost:5173
   • Backend:   http://localhost:5000
```

---

## 🌐 Access the Application

### Frontend (Main UI)
http://localhost:5173

**What to do**:
1. Click "Iniciar Sesión"
2. Register a new account
3. Create your first note
4. Click "Generate Summary" or other AI features
5. Explore!

### Backend (API)
http://localhost:5000/health

### Database Admin (pgAdmin)
http://localhost:5050
- Email: `admin@studyflow.com`
- Password: `admin`

---

## 🛑 Stopping

```bash
./stop.sh
```

---

## 🐛 Issues?

### "Port already in use"
```bash
# Stop conflicting services
sudo service postgresql stop  # If port 5432
lsof -ti:5000 | xargs kill    # If port 5000
lsof -ti:5173 | xargs kill    # If port 5173
```

### "Docker not running"
```bash
# Start Docker Desktop (if on Mac/Windows)
# Or on Linux:
sudo systemctl start docker
```

### "Node.js version too old"
```bash
# Install Node.js 18
nvm install 18
nvm use 18
```

### "Cannot connect to database"
```bash
# Restart PostgreSQL
docker-compose down
docker-compose up -d
```

---

## 📖 More Help

For detailed documentation, see:
- **[LAUNCH.md](LAUNCH.md)** - Complete setup guide
- **[README.md](README.md)** - Project overview
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment

---

**Good luck! 🚀**

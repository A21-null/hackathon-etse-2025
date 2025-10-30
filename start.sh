#!/bin/bash

# ============================================
# StudyFlow - Complete Startup Script
# ============================================
# This script launches the complete StudyFlow application
# including PostgreSQL, backend API, and frontend UI

set -e  # Exit on error

echo "============================================"
echo "  🚀 StudyFlow - Starting Application"
echo "============================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if port is in use
port_in_use() {
    lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1
}

# ============================================
# 1. Prerequisites Check
# ============================================
echo -e "${BLUE}[1/7] Checking prerequisites...${NC}"

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js v18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version 18+ is required (current: v$NODE_VERSION)${NC}"
    echo "Please upgrade Node.js"
    exit 1
fi

if ! command_exists docker; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    echo "Please install Docker from https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command_exists docker-compose; then
    echo -e "${RED}❌ Docker Compose is not installed${NC}"
    echo "Please install Docker Compose"
    exit 1
fi

echo -e "${GREEN}✅ All prerequisites met${NC}"
echo ""

# ============================================
# 2. Check Environment Files
# ============================================
echo -e "${BLUE}[2/7] Checking environment files...${NC}"

if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  Backend .env not found, copying from .env.example${NC}"
    cp backend/.env.example backend/.env
    echo -e "${RED}⚠️  IMPORTANT: Edit backend/.env and add your CLAUDE_API_KEY${NC}"
    read -p "Press Enter after you've configured backend/.env..."
fi

if [ ! -f "frontend/.env" ]; then
    echo -e "${YELLOW}⚠️  Frontend .env not found, copying from .env.example${NC}"
    cp frontend/.env.example frontend/.env
fi

# Check if CLAUDE_API_KEY is set
if ! grep -q "CLAUDE_API_KEY=sk-ant-" backend/.env 2>/dev/null; then
    echo -e "${RED}⚠️  WARNING: CLAUDE_API_KEY not configured in backend/.env${NC}"
    echo "The AI features will not work without a valid Claude API key"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo -e "${GREEN}✅ Environment files ready${NC}"
echo ""

# ============================================
# 3. Install Dependencies
# ============================================
echo -e "${BLUE}[3/7] Installing dependencies...${NC}"

# Backend dependencies
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend
    npm install
    cd ..
else
    echo "✓ Backend dependencies already installed"
fi

# Frontend dependencies
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
else
    echo "✓ Frontend dependencies already installed"
fi

echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# ============================================
# 4. Start PostgreSQL
# ============================================
echo -e "${BLUE}[4/7] Starting PostgreSQL with Docker...${NC}"

if docker-compose ps | grep -q "studyflow_postgres.*Up"; then
    echo "✓ PostgreSQL is already running"
else
    echo "🐳 Starting PostgreSQL container..."
    docker-compose up -d
    echo "⏳ Waiting for PostgreSQL to be ready..."
    sleep 5
fi

# Verify PostgreSQL is running
if ! docker-compose ps | grep -q "studyflow_postgres.*Up"; then
    echo -e "${RED}❌ Failed to start PostgreSQL${NC}"
    exit 1
fi

echo -e "${GREEN}✅ PostgreSQL is running${NC}"
echo ""

# ============================================
# 5. Initialize Database
# ============================================
echo -e "${BLUE}[5/7] Initializing database...${NC}"

cd backend
echo "📊 Synchronizing database schema..."
npm run db:sync || {
    echo -e "${RED}❌ Database sync failed${NC}"
    exit 1
}
cd ..

echo -e "${GREEN}✅ Database initialized${NC}"
echo ""

# ============================================
# 6. Start Backend Server
# ============================================
echo -e "${BLUE}[6/7] Starting backend server...${NC}"

if port_in_use 5000; then
    echo -e "${YELLOW}⚠️  Port 5000 is already in use${NC}"
    echo "Backend server may already be running"
else
    cd backend
    echo "🚀 Starting backend on port 5000..."
    npm run dev > ../backend.log 2>&1 &
    BACKEND_PID=$!
    cd ..

    # Wait for backend to start
    echo "⏳ Waiting for backend to be ready..."
    for i in {1..30}; do
        if curl -s http://localhost:5000/health > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Backend server is running (PID: $BACKEND_PID)${NC}"
            break
        fi
        sleep 1
        if [ $i -eq 30 ]; then
            echo -e "${RED}❌ Backend failed to start${NC}"
            echo "Check backend.log for details"
            exit 1
        fi
    done
fi

echo ""

# ============================================
# 7. Start Frontend Server
# ============================================
echo -e "${BLUE}[7/7] Starting frontend server...${NC}"

if port_in_use 5173; then
    echo -e "${YELLOW}⚠️  Port 5173 is already in use${NC}"
    echo "Frontend server may already be running"
else
    cd frontend
    echo "⚡ Starting frontend on port 5173..."
    npm run dev > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    cd ..

    echo "⏳ Waiting for frontend to be ready..."
    sleep 5
    echo -e "${GREEN}✅ Frontend server is running (PID: $FRONTEND_PID)${NC}"
fi

echo ""

# ============================================
# Success!
# ============================================
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}  ✅ StudyFlow is now running!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo "📡 Services:"
echo "   • Frontend:  http://localhost:5173"
echo "   • Backend:   http://localhost:5000"
echo "   • API Docs:  http://localhost:5000/health"
echo "   • pgAdmin:   http://localhost:5050"
echo ""
echo "📊 Credentials (pgAdmin):"
echo "   • Email:    admin@studyflow.com"
echo "   • Password: admin"
echo ""
echo "📝 Logs:"
echo "   • Backend:  tail -f backend.log"
echo "   • Frontend: tail -f frontend.log"
echo ""
echo "🛑 To stop all services, run:"
echo "   ./stop.sh"
echo ""
echo -e "${YELLOW}💡 Tip: Keep this terminal open to see any errors${NC}"
echo ""

# Keep script running and show logs
echo "📋 Showing recent backend logs (Ctrl+C to exit):"
echo "--------------------------------------------"
tail -f backend.log

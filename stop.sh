#!/bin/bash

# ============================================
# StudyFlow - Stop Script
# ============================================
# This script stops all StudyFlow services

echo "============================================"
echo "  🛑 StudyFlow - Stopping Application"
echo "============================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Stop frontend (port 5173)
echo "Stopping frontend server..."
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
    kill $(lsof -t -i:5173) 2>/dev/null
    echo -e "${GREEN}✅ Frontend stopped${NC}"
else
    echo "Frontend was not running"
fi

# Stop backend (port 5000)
echo "Stopping backend server..."
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    kill $(lsof -t -i:5000) 2>/dev/null
    echo -e "${GREEN}✅ Backend stopped${NC}"
else
    echo "Backend was not running"
fi

# Stop Docker containers
echo "Stopping PostgreSQL..."
docker-compose down

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}  ✅ All services stopped${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo "To start again, run: ./start.sh"
echo ""

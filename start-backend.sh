#!/bin/bash

# Script de inicio automático para StudyFlow Backend
# Ejecutar con: bash start-backend.sh

echo "🚀 Iniciando StudyFlow Backend..."
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Paso 1: Verificar Node.js
echo "📦 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js instalado: $(node --version)${NC}"
echo ""

# Paso 2: Verificar npm
echo "📦 Verificando npm..."
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm no está instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm instalado: $(npm --version)${NC}"
echo ""

# Paso 3: Verificar Docker
echo "🐳 Verificando Docker..."
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker no está instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker instalado${NC}"
echo ""

# Paso 4: Iniciar PostgreSQL
echo "🗄️  Iniciando PostgreSQL con Docker Compose..."
if docker-compose up -d; then
    echo -e "${GREEN}✅ PostgreSQL iniciado correctamente${NC}"
else
    echo -e "${RED}❌ Error al iniciar PostgreSQL${NC}"
    echo -e "${YELLOW}💡 Prueba con: sudo docker-compose up -d${NC}"
    echo -e "${YELLOW}💡 O ejecuta: newgrp docker${NC}"
    exit 1
fi
echo ""

# Esperar a que PostgreSQL esté listo
echo "⏳ Esperando a que PostgreSQL esté listo..."
sleep 5
echo ""

# Paso 5: Verificar que PostgreSQL está corriendo
echo "🔍 Verificando estado de PostgreSQL..."
if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✅ PostgreSQL está corriendo${NC}"
else
    echo -e "${RED}❌ PostgreSQL no está corriendo correctamente${NC}"
    exit 1
fi
echo ""

# Paso 6: Sincronizar base de datos
echo "🗄️  Sincronizando base de datos (creando tablas)..."
cd backend
if npm run db:sync; then
    echo -e "${GREEN}✅ Base de datos sincronizada${NC}"
else
    echo -e "${RED}❌ Error al sincronizar base de datos${NC}"
    exit 1
fi
echo ""

# Paso 7: Iniciar servidor
echo "🚀 Iniciando servidor backend..."
echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}   StudyFlow Backend está listo!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo "📡 Servidor corriendo en: http://localhost:5000"
echo "🗄️  PostgreSQL: localhost:5432"
echo "🖥️  pgAdmin: http://localhost:5050"
echo ""
echo "Para detener el servidor: Ctrl+C"
echo ""

npm run dev

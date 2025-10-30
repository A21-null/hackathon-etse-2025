#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🧹 Limpiando configuración de Claude Code${NC}"
echo ""

ANTHROPIC_DIR="$HOME/.anthropic"
API_KEY_FILE="$ANTHROPIC_DIR/api_key"

if [ -f "$API_KEY_FILE" ]; then
    rm -f "$API_KEY_FILE"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} API Key eliminada correctamente"
    else
        echo -e "${RED}❌${NC} Error eliminando la key"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠${NC}  No se encontró ninguna API key"
fi

unset ANTHROPIC_API_KEY

echo ""
echo -e "${GREEN}✅ Limpieza completada${NC}"
echo ""
echo "Gracias por participar en el hackathon! 🎉"
echo ""

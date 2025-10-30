#!/bin/bash

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

TEAM_NAME="equipo-3"
API_KEY="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"

echo -e "${BLUE}🚀 Configurando Claude Code para $TEAM_NAME${NC}"
echo ""

ANTHROPIC_DIR="$HOME/.anthropic"
mkdir -p "$ANTHROPIC_DIR"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Directorio creado: $ANTHROPIC_DIR"
else
    echo "❌ Error creando directorio"
    exit 1
fi

echo -n "$API_KEY" > "$ANTHROPIC_DIR/api_key"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} API Key guardada"
else
    echo "❌ Error guardando la key"
    exit 1
fi

chmod 600 "$ANTHROPIC_DIR/api_key"
echo -e "${GREEN}✓${NC} Permisos de seguridad establecidos"

echo ""
echo -e "${GREEN}✅ Configuración completada exitosamente${NC}"
echo ""
echo "Para verificar que funciona, ejecuta:"
echo -e "${BLUE}  claude --version${NC}"
echo ""
echo "¡Buena suerte en el hackathon! 🎉"

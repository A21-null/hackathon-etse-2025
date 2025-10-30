# ⚠️ Actualizar Node.js

## Problema

Tu versión actual de Node.js es **v12.22.9**, pero StudyFlow requiere **Node.js v18+** porque:
- El SDK de Anthropic Claude usa características modernas (operador `??`)
- Node.js v12 llegó a EOL (fin de vida) en abril 2022
- Muchas dependencias modernas requieren Node v14+

## Solución: Actualizar Node.js

### Opción 1: Usando NodeSource (Recomendado)

Instala Node.js v18 LTS:

```bash
# Descargar script de instalación
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Instalar Node.js
sudo apt-get install -y nodejs

# Verificar versión
node --version  # Debería mostrar v18.x.x
npm --version   # Debería mostrar 9.x.x o superior
```

### Opción 2: Usando nvm (Node Version Manager)

Si prefieres manejar múltiples versiones de Node:

```bash
# Instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Recargar configuración
source ~/.bashrc

# Instalar Node.js v18
nvm install 18

# Usar Node.js v18
nvm use 18

# Establecer como predeterminado
nvm alias default 18

# Verificar
node --version
```

### Opción 3: Usando apt (versión más antigua pero funcional)

```bash
sudo apt update
sudo apt install nodejs npm

# Si la versión sigue siendo antigua, usa NodeSource (Opción 1)
```

---

## Después de Actualizar

Una vez que tengas Node.js v18+:

### 1. Reinstalar dependencias
```bash
cd /home/mpereiroc/.local/share/Trash/files/equipo-3/backend
rm -rf node_modules package-lock.json
npm install
```

### 2. Iniciar PostgreSQL (si no está corriendo)
```bash
cd /home/mpereiroc/.local/share/Trash/files/equipo-3
sudo docker-compose up -d
```

### 3. Sincronizar base de datos
```bash
cd backend
npm run db:sync
```

### 4. Iniciar servidor
```bash
npm run dev
```

Ahora debería funcionar correctamente.

---

## Verificación Rápida

```bash
# Versión de Node (debe ser v18+)
node --version

# Versión de npm (debe ser 9+)
npm --version
```

---

## ¿Por qué Node.js v18?

- ✅ **LTS (Long Term Support)**: Soporte hasta abril 2025
- ✅ **Moderno**: Soporta todas las características ES2022
- ✅ **Compatible**: Funciona con el SDK de Anthropic
- ✅ **Estable**: Versión recomendada para producción
- ✅ **Incluye npm 9+**: Mejor rendimiento

---

## Troubleshooting

### Error: "comando no encontrado" después de instalar

Reinicia tu terminal o ejecuta:
```bash
source ~/.bashrc
```

### Quiero mantener mi Node.js actual

Usa `nvm` (Opción 2) para tener múltiples versiones:
```bash
nvm install 18    # Instalar v18
nvm use 18        # Usar v18 para este proyecto
nvm use 12        # Volver a v12 si necesitas
```

### Error al instalar con NodeSource

Verifica tu distribución:
```bash
lsb_release -a
```

Si no es Ubuntu/Debian, consulta: https://nodejs.org/en/download/package-manager

---

## Resumen

**Comando rápido (recomendado):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
cd /home/mpereiroc/.local/share/Trash/files/equipo-3/backend
rm -rf node_modules package-lock.json
npm install
```

¡Listo para continuar!

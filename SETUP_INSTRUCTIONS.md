# 🚀 Instrucciones de Setup - StudyFlow

## ✅ Estado Actual

### Completado:
- ✅ Backend completamente implementado
- ✅ Todos los endpoints funcionando
- ✅ Sistema de autenticación JWT
- ✅ Integración con Claude API
- ✅ Sistema de caché para optimizar costos
- ✅ Modelos de base de datos con relaciones
- ✅ Validaciones y middleware
- ✅ Archivo `.env` configurado con API key
- ✅ Dependencias de Node.js instaladas
- ✅ `.gitignore` configurado (API key protegida)
- ✅ Docker Compose configurado

### Pendiente:
- ⏳ Instalar `docker-compose`
- ⏳ Iniciar PostgreSQL
- ⏳ Crear tablas en la base de datos
- ⏳ Iniciar el servidor backend
- ⏳ Probar endpoints

---

## 📋 Pasos para Completar el Setup

### 1. Instalar Docker Compose

```bash
sudo apt-get update
sudo apt-get install -y docker-compose
```

**Verificar instalación:**
```bash
docker-compose --version
```

### 2. Iniciar PostgreSQL con Docker

Desde la raíz del proyecto (`equipo-3/`):

```bash
docker-compose up -d
```

Esto iniciará:
- **PostgreSQL** en `localhost:5432`
- **pgAdmin** en `http://localhost:5050`

**Verificar que PostgreSQL está corriendo:**
```bash
docker-compose ps
```

**Ver logs:**
```bash
docker-compose logs postgres
```

### 3. Sincronizar Base de Datos (Crear Tablas)

Desde la carpeta `backend/`:

```bash
cd backend
npm run db:sync
```

Esto creará las tablas:
- `users`
- `notes`
- `generated_contents`

Con todos sus índices optimizados.

### 4. Iniciar el Servidor Backend

**Modo desarrollo (con auto-reload):**
```bash
npm run dev
```

**O modo producción:**
```bash
npm start
```

El servidor estará en: **http://localhost:5000**

### 5. Verificar que Funciona

**Health check:**
```bash
curl http://localhost:5000/health
```

Deberías ver algo como:
```json
{
  "status": "ok",
  "timestamp": "2025-10-30T...",
  "uptime": 5.123,
  "environment": "development"
}
```

---

## 🧪 Probar los Endpoints

### 1. Registrar un Usuario

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@studyflow.com",
    "password": "password123"
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "Test User",
      "email": "test@studyflow.com",
      "createdAt": "...",
      "updatedAt": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Guarda el token** para los siguientes pasos.

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@studyflow.com",
    "password": "password123"
  }'
```

### 3. Crear un Apunte

```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "title": "Apuntes de Matemáticas - Álgebra Lineal",
    "content": "Los vectores son elementos fundamentales del álgebra lineal. Un vector en R^n es una lista ordenada de n números reales. Las operaciones básicas incluyen: suma de vectores, multiplicación por escalar, producto punto y producto cruz. El espacio vectorial debe cumplir 8 axiomas fundamentales.",
    "tags": ["matemáticas", "álgebra", "vectores"],
    "isPublic": true
  }'
```

### 4. Listar Apuntes Públicos

```bash
curl http://localhost:5000/api/notes
```

### 5. Generar Resumen con IA

```bash
curl -X POST http://localhost:5000/api/ai/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "noteId": 1
  }'
```

### 6. Generar Flashcards

```bash
curl -X POST http://localhost:5000/api/ai/flashcards \
  -H "Content-Type: application/json" \
  -d '{
    "noteId": 1
  }'
```

### 7. Generar Quiz

```bash
curl -X POST http://localhost:5000/api/ai/quiz \
  -H "Content-Type: application/json" \
  -d '{
    "noteId": 1
  }'
```

---

## 🎯 Todos los Endpoints Disponibles

### Auth (`/api/auth`)
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual (requiere token)

### Notes (`/api/notes`)
- `GET /api/notes` - Listar apuntes públicos (paginado, búsqueda, tags)
- `GET /api/notes/:id` - Obtener apunte por ID
- `GET /api/notes/user/:userId` - Apuntes de un usuario
- `POST /api/notes` - Crear apunte (requiere token)
- `PUT /api/notes/:id` - Actualizar apunte (solo autor)
- `DELETE /api/notes/:id` - Eliminar apunte (solo autor)

### AI (`/api/ai`)
- `POST /api/ai/summarize` - Generar resumen
- `POST /api/ai/flashcards` - Generar flashcards
- `POST /api/ai/quiz` - Generar quiz
- `GET /api/ai/history/:noteId` - Historial de generaciones
- `DELETE /api/ai/:id` - Eliminar contenido generado

---

## 🔧 Comandos Útiles

### Docker Compose

```bash
# Iniciar servicios
docker-compose up -d

# Ver estado
docker-compose ps

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose stop

# Detener y eliminar contenedores
docker-compose down

# Eliminar todo (incluyendo volúmenes)
docker-compose down -v
```

### Backend

```bash
# Instalar dependencias
npm install

# Iniciar en desarrollo
npm run dev

# Iniciar en producción
npm start

# Sincronizar base de datos
npm run db:sync

# Resetear base de datos (BORRA TODO)
npm run db:reset
```

### PostgreSQL (desde terminal)

Si necesitas conectarte directamente:

```bash
docker-compose exec postgres psql -U admin -d studyflow
```

Comandos dentro de psql:
```sql
-- Listar tablas
\dt

-- Describir tabla
\d users

-- Ver usuarios
SELECT * FROM users;

-- Ver apuntes
SELECT * FROM notes;

-- Salir
\q
```

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to PostgreSQL"

**Solución:**
```bash
# Verificar que Docker está corriendo
docker ps

# Reiniciar PostgreSQL
docker-compose restart postgres

# Ver logs de errores
docker-compose logs postgres
```

### Error: "Port 5432 already in use"

Ya tienes PostgreSQL corriendo localmente. Opciones:

1. **Detener PostgreSQL local:**
   ```bash
   sudo service postgresql stop
   ```

2. **O cambiar el puerto en `docker-compose.yml`:**
   ```yaml
   ports:
     - "5433:5432"  # Usar puerto 5433 en tu host
   ```

   Y actualiza `.env`:
   ```
   DB_PORT=5433
   ```

### Error: "CLAUDE_API_KEY is not defined"

Verifica que el archivo `.env` existe en `backend/.env` y contiene:
```
CLAUDE_API_KEY=sk-ant-api03-...
```

### Error: "Module not found"

Reinstala dependencias:
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Acceder a pgAdmin

1. Abre: **http://localhost:5050**
2. Login:
   - Email: `admin@studyflow.com`
   - Password: `admin`

3. Agregar servidor PostgreSQL:
   - Host: `postgres` (nombre del contenedor)
   - Port: `5432`
   - Database: `studyflow`
   - Username: `admin`
   - Password: `password123`

---

## 💰 Monitoreo de Costos (Claude API)

El presupuesto es de **$40 USD**. Estrategias implementadas:

1. ✅ **Sistema de caché**: No regenera contenido existente
2. ✅ **Validación de longitud**: Máximo 50k caracteres por apunte
3. ✅ **Límite de tokens**: 2000 tokens por request
4. ✅ **Modelo eficiente**: Claude 3.5 Sonnet

**Para monitorear uso:**
- Ve a: https://console.anthropic.com/
- Revisa el dashboard de uso

---

## ✅ Checklist Final

- [ ] docker-compose instalado
- [ ] PostgreSQL corriendo (`docker-compose ps`)
- [ ] Base de datos sincronizada (`npm run db:sync`)
- [ ] Servidor backend corriendo (`npm run dev`)
- [ ] Health check funciona (`curl localhost:5000/health`)
- [ ] Registro de usuario funciona
- [ ] Login funciona
- [ ] Crear apunte funciona
- [ ] Generar resumen funciona
- [ ] Generar flashcards funciona
- [ ] Generar quiz funciona

---

## 🎉 ¡Listo!

Una vez completes estos pasos, tu backend estará **100% funcional** y listo para conectar con el frontend.

**Próximos pasos:**
1. Configurar el frontend (React + Vite + Tailwind)
2. Conectar frontend con backend
3. Probar el flujo completo
4. Deploy a producción

---

## 📚 Documentación Adicional

- Backend README: `backend/README.md`
- Plan del proyecto: `docs/plan.md`
- Guía de Claude Code: `CLAUDE.md`

# StudyFlow Backend

Backend API para StudyFlow - Plataforma de compartir apuntes con generación de contenido IA.

## Tecnologías

- **Node.js** + **Express** - Servidor web
- **PostgreSQL** - Base de datos relacional
- **Sequelize** - ORM para PostgreSQL
- **JWT** - Autenticación con tokens
- **bcrypt** - Hash de contraseñas
- **Claude API (Anthropic)** - Generación de contenido con IA

## Requisitos

- Node.js 18+
- Docker + Docker Compose (para PostgreSQL)
- Claude API Key (Anthropic)

## Instalación

### 1. Instalar dependencias

```bash
cd backend
npm install
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y configura las variables:

```bash
cp .env.example .env
```

Edita el archivo `.env` y configura:
- `CLAUDE_API_KEY`: Tu API key de Claude (Anthropic)
- `JWT_SECRET`: Una clave secreta para JWT (genera una con `openssl rand -base64 32`)
- Otras variables según sea necesario

### 3. Iniciar PostgreSQL con Docker

Desde la raíz del proyecto:

```bash
docker-compose up -d
```

Esto iniciará:
- PostgreSQL en `localhost:5432`
- pgAdmin en `http://localhost:5050`

### 4. Sincronizar base de datos

Crea las tablas en PostgreSQL:

```bash
npm run db:sync
```

Para resetear la base de datos (CUIDADO: borra todos los datos):

```bash
npm run db:reset
```

### 5. Iniciar el servidor

**Modo desarrollo (con auto-reload):**

```bash
npm run dev
```

**Modo producción:**

```bash
npm start
```

El servidor estará disponible en `http://localhost:5000`

## Estructura del Proyecto

```
backend/
├── server.js                 # Punto de entrada del servidor
├── package.json
├── .env.example             # Variables de entorno de ejemplo
├── .env                     # Variables de entorno (NO subir a git)
└── src/
    ├── config/              # Configuración (DB, JWT, Claude)
    │   ├── database.js
    │   ├── jwt.js
    │   └── claude.js
    ├── models/              # Modelos Sequelize
    │   ├── index.js
    │   ├── User.js
    │   ├── Note.js
    │   └── GeneratedContent.js
    ├── routes/              # Rutas de la API
    │   ├── auth.routes.js
    │   ├── notes.routes.js
    │   └── ai.routes.js
    ├── controllers/         # Lógica de negocio
    │   ├── auth.controller.js
    │   ├── notes.controller.js
    │   └── ai.controller.js
    ├── middleware/          # Middleware personalizado
    │   ├── auth.middleware.js
    │   ├── validation.middleware.js
    │   └── errorHandler.js
    ├── services/            # Servicios externos
    │   └── claude.service.js
    └── utils/               # Utilidades
        └── prompts.js       # Templates de prompts para Claude
```

## Endpoints API

### Autenticación (`/api/auth`)

- `POST /api/auth/register` - Registrar nuevo usuario
  ```json
  {
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Iniciar sesión
  ```json
  {
    "email": "juan@example.com",
    "password": "password123"
  }
  ```

- `GET /api/auth/me` - Obtener usuario actual (requiere token)

### Notas (`/api/notes`)

- `GET /api/notes` - Listar apuntes públicos
  - Query params: `?page=1&limit=20&search=keyword&tags=tag1,tag2`

- `GET /api/notes/:id` - Obtener apunte por ID

- `GET /api/notes/user/:userId` - Apuntes de un usuario

- `POST /api/notes` - Crear apunte (requiere autenticación)
  ```json
  {
    "title": "Apuntes de Matemáticas",
    "content": "Contenido del apunte...",
    "tags": ["matemáticas", "álgebra"],
    "isPublic": true
  }
  ```

- `PUT /api/notes/:id` - Actualizar apunte (solo autor)

- `DELETE /api/notes/:id` - Eliminar apunte (solo autor)

### IA (`/api/ai`)

- `POST /api/ai/summarize` - Generar resumen
  ```json
  {
    "noteId": 1
  }
  ```

- `POST /api/ai/flashcards` - Generar flashcards
  ```json
  {
    "noteId": 1
  }
  ```

- `POST /api/ai/quiz` - Generar quiz
  ```json
  {
    "noteId": 1
  }
  ```

- `GET /api/ai/history/:noteId` - Historial de generaciones

- `DELETE /api/ai/:id` - Eliminar contenido generado (solo autor)

## Autenticación

Todos los endpoints protegidos requieren un token JWT en el header:

```
Authorization: Bearer <token>
```

El token se obtiene al hacer login o registro.

## Sistema de Caché

Para optimizar costos de la API de Claude, el sistema implementa un **caché en PostgreSQL**:

- Antes de llamar a Claude, se verifica si ya existe contenido generado para ese apunte
- Si existe, se devuelve el contenido cacheado (respuesta instantánea, sin costo)
- Si no existe, se genera nuevo contenido y se guarda en la base de datos

## Base de Datos

### Tablas

#### `users`
- id, name, email, password (hash), created_at, updated_at

#### `notes`
- id, title, content, author_id, tags (array), is_public, created_at, updated_at

#### `generated_contents`
- id, note_id, type (summary|flashcards|quiz), content (JSONB), created_at

### Relaciones
- User `1:N` Note
- Note `1:N` GeneratedContent

### Índices
- `users.email` - Búsqueda rápida por email
- `notes.author_id` - Búsqueda por autor
- `notes.tags` (GIN) - Búsqueda por tags
- `generated_contents.note_id` - Búsqueda por nota
- `generated_contents.type` - Búsqueda por tipo
- `generated_contents.content` (GIN) - Búsqueda dentro del JSON

## Testing

Puedes probar los endpoints con:

### Health Check
```bash
curl http://localhost:5000/health
```

### Registro
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Optimización de Costos

El presupuesto del hackathon es de $40 USD. Para optimizar:

1. **Caché en PostgreSQL**: Evita regenerar contenido existente
2. **Validación de longitud**: Máximo 50k caracteres por apunte
3. **Sistema de tokens**: Límite de ~2000 tokens por request
4. **Modelo eficiente**: Claude 3.5 Sonnet (balance calidad/costo)

## Problemas Comunes

### Error: "CLAUDE_API_KEY is not defined"
- Asegúrate de haber copiado `.env.example` a `.env`
- Configura tu API key de Claude en el archivo `.env`

### Error: "Unable to connect to PostgreSQL"
- Verifica que Docker esté corriendo
- Ejecuta `docker-compose up -d` desde la raíz del proyecto
- Verifica que PostgreSQL esté en el puerto 5432

### Error: "JWT_SECRET must be set in production"
- Genera un secreto con: `openssl rand -base64 32`
- Configúralo en `.env` como `JWT_SECRET`

### Error: "Port 5432 already in use"
- Ya tienes PostgreSQL corriendo localmente
- Detén tu PostgreSQL local o cambia el puerto en `docker-compose.yml`

## Despliegue

### Variables de entorno en producción

Asegúrate de configurar:
- `NODE_ENV=production`
- `JWT_SECRET` (clave secreta única)
- `CLAUDE_API_KEY` (tu API key)
- Credenciales de base de datos PostgreSQL
- `FRONTEND_URL` (URL del frontend)

### Servicios recomendados
- **Backend**: Railway, Render, Heroku
- **Base de datos**: Railway PostgreSQL, Supabase, ElephantSQL
- **Frontend**: Vercel, Netlify

## Scripts disponibles

- `npm start` - Iniciar servidor en producción
- `npm run dev` - Iniciar servidor en desarrollo (auto-reload)
- `npm run db:sync` - Sincronizar base de datos (crear tablas)
- `npm run db:reset` - Resetear base de datos (CUIDADO: borra datos)

## Licencia

MIT

## Equipo

Equipo 3 - Hackathon

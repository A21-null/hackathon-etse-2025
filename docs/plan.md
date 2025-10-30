# 🎯 PLAN ARQUITECTÓNICO COMPLETO - StudyFlow

## 📋 RESUMEN EJECUTIVO

**Proyecto:** StudyFlow - Plataforma web para compartir apuntes y generar material de estudio con IA

**Stack Tecnológico:**
- Frontend: React + Tailwind CSS
- Backend: Node.js + Express
- Base de datos: PostgreSQL + Sequelize
- Autenticación: JWT + bcrypt
- IA: Claude API (Anthropic)

**Restricciones:**
- Presupuesto: $40 USD
- Tiempo: 8 horas
- Equipo: 4 desarrolladores

---

## 📁 1. ESTRUCTURA DE CARPETAS

```
equipo-3/
├── .gitignore
├── README.md
├── CLAUDE.md
├── docker-compose.yml
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   ├── .env.example
│   ├── public/
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── api/
│       │   ├── axios.js
│       │   ├── auth.js
│       │   ├── notes.js
│       │   └── ai.js
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Navbar.jsx
│       │   │   └── Footer.jsx
│       │   ├── notes/
│       │   │   ├── NoteCard.jsx
│       │   │   ├── NoteList.jsx
│       │   │   ├── NoteDetail.jsx
│       │   │   └── NoteEditor.jsx
│       │   ├── ai/
│       │   │   ├── AIGeneratorPanel.jsx
│       │   │   ├── SummaryView.jsx
│       │   │   ├── FlashcardView.jsx
│       │   │   └── QuizView.jsx
│       │   └── auth/
│       │       ├── LoginForm.jsx
│       │       └── RegisterForm.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── NotesPage.jsx
│       │   ├── NoteDetailPage.jsx
│       │   ├── CreateNotePage.jsx
│       │   ├── MyNotesPage.jsx
│       │   └── AuthPage.jsx
│       ├── hooks/
│       │   ├── useAuth.js
│       │   └── useNotes.js
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── utils/
│       │   └── helpers.js
│       └── styles/
│           └── index.css
│
└── backend/
    ├── package.json
    ├── .env.example
    ├── server.js
    └── src/
        ├── config/
        │   ├── database.js
        │   ├── claude.js
        │   └── jwt.js
        ├── models/
        │   ├── index.js
        │   ├── User.js
        │   ├── Note.js
        │   └── GeneratedContent.js
        ├── routes/
        │   ├── auth.routes.js
        │   ├── notes.routes.js
        │   └── ai.routes.js
        ├── controllers/
        │   ├── auth.controller.js
        │   ├── notes.controller.js
        │   └── ai.controller.js
        ├── middleware/
        │   ├── auth.middleware.js
        │   ├── validation.middleware.js
        │   └── errorHandler.js
        ├── services/
        │   ├── claude.service.js
        │   └── content.service.js
        └── utils/
            ├── prompts.js
            └── validators.js
```

---

## 🗄️ 2. ESQUEMA DE BASE DE DATOS (PostgreSQL)

### Tabla: `users`
```sql
id          SERIAL PRIMARY KEY
name        VARCHAR(255) NOT NULL
email       VARCHAR(255) UNIQUE NOT NULL
password    VARCHAR(255) NOT NULL  -- bcrypt hash
created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP

INDEX: idx_users_email ON email
```

### Tabla: `notes`
```sql
id          SERIAL PRIMARY KEY
title       VARCHAR(500) NOT NULL
content     TEXT NOT NULL
author_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
tags        TEXT[]  -- Array PostgreSQL
is_public   BOOLEAN DEFAULT true
created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP

INDEX: idx_notes_author ON author_id
INDEX: idx_notes_created ON created_at DESC
INDEX: idx_notes_tags ON tags USING GIN
```

### Tabla: `generated_contents`
```sql
id          SERIAL PRIMARY KEY
note_id     INTEGER NOT NULL REFERENCES notes(id) ON DELETE CASCADE
type        VARCHAR(50) NOT NULL  -- 'summary' | 'flashcards' | 'quiz'
content     JSONB NOT NULL
created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP

INDEX: idx_generated_note ON note_id
INDEX: idx_generated_type ON type
INDEX: idx_generated_content ON content USING GIN
```

**Relaciones:**
- User `1:N` Note
- Note `1:N` GeneratedContent

---

## 🔌 3. ENDPOINTS API

### Auth (`/api/auth`)
```
POST   /api/auth/register    - Crear usuario (name, email, password)
POST   /api/auth/login       - Login → devuelve JWT
GET    /api/auth/me          - Usuario actual [protegido]
```

### Notes (`/api/notes`)
```
GET    /api/notes                   - Listar públicos (paginado, search, tags)
GET    /api/notes/:id               - Detalle de apunte
GET    /api/notes/user/:userId      - Apuntes de usuario
POST   /api/notes                   - Crear [protegido]
PUT    /api/notes/:id               - Actualizar [protegido, solo autor]
DELETE /api/notes/:id               - Eliminar [protegido, solo autor]
```

### AI (`/api/ai`)
```
POST   /api/ai/summarize            - Generar resumen (body: {noteId})
POST   /api/ai/flashcards           - Generar flashcards (body: {noteId})
POST   /api/ai/quiz                 - Generar quiz (body: {noteId})
GET    /api/ai/history/:noteId      - Historial de generaciones
DELETE /api/ai/:id                  - Eliminar contenido generado [protegido]
```

---

## 🤖 4. ORQUESTACIÓN CLAUDE API

### Arquitectura
1. **Servicio centralizado**: `claude.service.js`
   - Función: `callClaude(prompt, systemPrompt)`
   - Manejo de errores (401, 429, 529)
   - Parsing de respuestas JSON

2. **Templates de prompts**: `prompts.js`
   - 3 tipos: summary, flashcards, quiz
   - System prompts especializados
   - User prompts con formato específico

3. **Sistema de caché**
   - Guardar en `generated_contents` (PostgreSQL)
   - Verificar antes de llamar Claude API
   - Evitar regeneración = ahorrar costos

### Flujo de Generación
```
1. Frontend → POST /api/ai/summarize {noteId: 123}
2. Backend busca Note con id=123
3. Backend verifica caché: ¿existe summary para noteId=123?
   - SI → devolver cached content
   - NO → continuar
4. Construir prompt usando PROMPTS.summarize(note.content)
5. Llamar Claude API
6. Parsear respuesta (JSON si flashcards/quiz, Markdown si summary)
7. Guardar en generated_contents (type='summary', content={text: ...})
8. Devolver al frontend
```

### Ejemplo Prompt Summary
```
System: "Eres un asistente educativo experto en resumir apuntes académicos."

User:
Analiza los siguientes apuntes y genera un resumen estructurado:

APUNTES:
[contenido del apunte]

Genera:
- Conceptos clave (3-5 puntos)
- Ideas secundarias
- Conclusión breve

Formato: Markdown
```

### Ejemplo Prompt Flashcards
```
System: "Eres experto en crear flashcards efectivas para memorización."

User:
Genera 8-10 flashcards en formato JSON:

APUNTES:
[contenido]

Formato:
[
  {"front": "Pregunta", "back": "Respuesta", "difficulty": "easy|medium|hard"}
]

SOLO responde con el JSON array, sin texto adicional.
```

### Ejemplo Prompt Quiz
```
System: "Eres profesor experto en crear exámenes de opción múltiple."

User:
Genera 5 preguntas de opción múltiple:

APUNTES:
[contenido]

Formato:
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 0,
    "explanation": "..."
  }
]

SOLO responde con el JSON array.
```

---

## 👥 5. PLAN DE TRABAJO PARALELO (4 DEVS × 8 HORAS)

### 🔵 DEV 1 - BACKEND + DATABASE LEAD

**Sprint 1 (H1-2): Setup Backend + DB**
- Inicializar PostgreSQL (Docker o local)
- `npm init` + instalar dependencias
- Crear modelos Sequelize (User, Note, GeneratedContent)
- Configurar conexión PostgreSQL
- Sincronizar tablas

**Sprint 2 (H3-4): Auth + Notes CRUD**
- Routes + Controllers de autenticación
- Routes + Controllers de notas (CRUD completo)
- Middleware JWT
- Testing con Postman

**Sprint 3 (H5-6): Integración Claude API**
- Servicio Claude (`callClaude()`)
- Templates de prompts (3 tipos)
- Controllers AI con sistema de caché
- Parser JSON para flashcards/quiz

**Sprint 4 (H7-8): Testing + Deploy**
- Testing endpoints
- Optimizar queries SQL
- Variables de entorno
- Deploy backend (Render/Railway)

---

### 🟢 DEV 2 - FRONTEND CORE

**Sprint 1 (H1-2): Setup Frontend**
- Crear proyecto Vite + React
- Configurar Tailwind CSS
- Instalar dependencias (axios, react-router-dom, etc.)
- Estructura de carpetas

**Sprint 2 (H3-4): Autenticación UI**
- AuthContext (manejo de estado global)
- LoginForm + RegisterForm
- Navbar con auth
- Protección de rutas

**Sprint 3 (H5-6): Notas UI (lectura)**
- NoteList con paginación
- NoteCard component
- NoteDetailPage
- Integración con API

**Sprint 4 (H7-8): Polish**
- Estilos finales
- Responsive design
- Loading states
- Error handling

---

### 🟡 DEV 3 - FEATURES FULL-STACK

**Sprint 1 (H1-2): Infraestructura**
- Docker Compose (PostgreSQL + pgAdmin)
- .gitignore
- .env.example

**Sprint 2 (H3-4): Editor de Apuntes**
- NoteEditor component (formulario)
- Input para tags (array)
- CreateNotePage
- Integración con POST /api/notes

**Sprint 3 (H5-6): Features IA Frontend**
- AIGeneratorPanel (3 botones)
- SummaryView (markdown)
- FlashcardView (flip animation)
- QuizView (interactivo)

**Sprint 4 (H7-8): Búsqueda + Extras**
- Barra de búsqueda
- Filtros por tags
- MyNotesPage (apuntes del usuario)

---

### 🟣 DEV 4 - QA + DEVOPS

**Sprint 1 (H1-3): Documentación**
- README completo
- Documentar endpoints API
- Diagrama ER de base de datos
- Instrucciones de instalación

**Sprint 2 (H4-5): Testing Manual**
- Testing flujo completo
- Reportar bugs
- Cross-browser testing

**Sprint 3 (H6-7): Optimización**
- Monitorear costos Claude API
- Verificar sistema de caché
- Optimizar queries SQL
- Rate limiting si necesario

**Sprint 4 (H8): Deploy + Demo**
- Deploy frontend (Vercel/Netlify)
- Deploy backend
- Configurar producción
- Preparar demo

---

## 🐳 6. DOCKER COMPOSE

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: studyflow
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  pgadmin:
    image: dpage/pgadmin4
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@studyflow.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"

volumes:
  postgres_data:
```

---

## 💰 7. OPTIMIZACIÓN DE PRESUPUESTO ($40 USD)

### Cálculos
- Modelo: Claude 3.5 Sonnet
- Costo aproximado: ~$0.006 por request (2000 tokens)
- Presupuesto: $40 → ~6,600 requests

### Estrategias de Ahorro
1. **Caché en PostgreSQL**: NO regenerar contenido existente
2. **Límites**: Max 1 generación de cada tipo por apunte
3. **Validación**: Max 50k caracteres por apunte
4. **Rate limiting**: Max 10 generaciones/usuario/hora
5. **Monitoreo**: Alert cuando llegue a $30

---

## ✅ 8. CHECKLIST FINAL

### Backend
- [ ] PostgreSQL conectado
- [ ] 3 modelos creados + asociaciones
- [ ] Auth JWT funcionando
- [ ] CRUD notas completo
- [ ] Claude API integrada (3 tipos)
- [ ] Sistema de caché funcionando
- [ ] Índices GIN optimizados

### Frontend
- [ ] React + Tailwind configurado
- [ ] Login/Register funcional
- [ ] Listar apuntes públicos
- [ ] Ver detalle de apunte
- [ ] Crear/editar apuntes
- [ ] Generar 3 tipos de contenido IA
- [ ] Visualizaciones interactivas

### Deploy
- [ ] Frontend deployado
- [ ] Backend deployado
- [ ] PostgreSQL en producción
- [ ] Variables de entorno configuradas
- [ ] Demo funcionando

---

## 📊 9. CRONOGRAMA VISUAL

```
┌─────────────────────────────────────────────────────────┐
│ SPRINT 1 (H1-2): 🔧 SETUP                              │
├─────────────────────────────────────────────────────────┤
│ Dev 1: PostgreSQL + Backend init                        │
│ Dev 2: React + Tailwind init                            │
│ Dev 3: Docker + infraestructura                         │
│ Dev 4: Documentación base                               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ SPRINT 2 (H3-4): 🔐 AUTH + CRUD                        │
├─────────────────────────────────────────────────────────┤
│ Dev 1: Auth API + Notes CRUD                            │
│ Dev 2: Auth UI (login/register)                         │
│ Dev 3: Editor de apuntes                                │
│ Dev 4: Testing manual                                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ SPRINT 3 (H5-6): 🤖 FEATURES IA                        │
├─────────────────────────────────────────────────────────┤
│ Dev 1: Claude API integration                           │
│ Dev 2: Notas UI (lista/detalle)                         │
│ Dev 3: IA UI (3 generadores)                            │
│ Dev 4: Testing + optimización                           │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ SPRINT 4 (H7-8): 🚀 POLISH + DEPLOY                    │
├─────────────────────────────────────────────────────────┤
│ Dev 1: Testing backend + deploy                         │
│ Dev 2: Responsive + estilos                             │
│ Dev 3: Búsqueda + filtros                               │
│ Dev 4: Deploy + demo prep                               │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 RESUMEN

**StudyFlow** permite compartir apuntes públicamente y generar material de estudio con IA (resúmenes, flashcards, quizzes).

**Arquitectura:**
- Frontend: React + Tailwind
- Backend: Express + PostgreSQL
- IA: Claude API con sistema de caché

**Organización:**
- 4 desarrolladores trabajando en paralelo
- 8 horas divididas en 4 sprints de 2 horas
- Roles: Backend Lead, Frontend Lead, Full-stack Features, QA/DevOps

**Optimizaciones:**
- Caché en PostgreSQL para reducir costos de API
- Índices GIN para búsquedas rápidas
- JSONB para contenido flexible

---

**✅ PLAN COMPLETO - LISTO PARA IMPLEMENTACIÓN**

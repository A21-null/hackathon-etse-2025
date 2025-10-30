# StudyFlow Frontend - Guía de Desarrollo

## 📋 Estructura Completada

El frontend ha sido desarrollado completamente siguiendo la arquitectura descrita en `docs/plan.md`. A continuación se detalla la estructura:

### 🏗️ Carpetas y Componentes

```
frontend/src/
├── main.jsx                          # Punto de entrada
├── App.jsx                           # Router y estructura principal
├── api/                              # API clients
│   ├── axios.js                      # Configuración axios con interceptores
│   ├── auth.js                       # Endpoints de autenticación
│   ├── notes.js                      # Endpoints de apuntes
│   └── ai.js                         # Endpoints de IA
├── context/
│   └── AuthContext.jsx               # Contexto global de autenticación
├── hooks/
│   ├── useAuth.js                    # Hook para autenticación
│   └── useNotes.js                   # Hook para gestión de apuntes
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx               # Barra de navegación con auth
│   │   └── Footer.jsx               # Pie de página
│   ├── auth/
│   │   ├── LoginForm.jsx            # Formulario de login
│   │   └── RegisterForm.jsx         # Formulario de registro
│   ├── notes/
│   │   ├── NoteCard.jsx             # Tarjeta individual de apunte
│   │   └── NoteList.jsx             # Grid de apuntes
│   ├── ai/
│   │   ├── AIGeneratorPanel.jsx     # Panel con 3 generadores de IA
│   │   ├── SummaryView.jsx          # Vista de resumen (Markdown)
│   │   ├── FlashcardView.jsx        # Vista interactiva de flashcards
│   │   └── QuizView.jsx             # Vista interactiva de quiz
│   └── ProtectedRoute.jsx           # Wrapper para rutas protegidas
├── pages/
│   ├── Home.jsx                      # Página de inicio
│   ├── AuthPage.jsx                  # Página de login/registro
│   ├── NotesPage.jsx                # Listar apuntes públicos
│   ├── NoteDetailPage.jsx           # Detalle de apunte + generador IA
│   ├── CreateNotePage.jsx           # Crear nuevo apunte
│   └── MyNotesPage.jsx              # Mis apuntes personales
└── styles/
    └── index.css                     # Estilos Tailwind + componentes custom

```

## 🎯 Características Implementadas

### 1. **Autenticación**
- ✅ Login / Registro con validación
- ✅ AuthContext para estado global
- ✅ JWT token almacenado en localStorage
- ✅ Rutas protegidas (ProtectedRoute)
- ✅ Interceptores de axios para token

### 2. **Gestión de Apuntes**
- ✅ Listar apuntes públicos con búsqueda y filtros por etiqueta
- ✅ Ver detalle de apunte con Markdown rendering
- ✅ Crear nuevos apuntes (solo autenticados)
- ✅ Editar y eliminar apuntes (solo autor)
- ✅ Soporte para tags y privacidad

### 3. **Características de IA**
- ✅ **Generador de Resúmenes**: Renderiza contenido Markdown
- ✅ **Flashcards Interactivas**: 
  - Flip animation
  - Navegación entre tarjetas
  - Mostrador de progreso
  - Soporte para dificultad (easy/medium/hard)
- ✅ **Quiz Interactivo**:
  - Opción múltiple
  - Retroalimentación inmediata
  - Explicaciones de respuestas
  - Resultados finales con porcentaje

### 4. **UX/UI**
- ✅ Diseño responsive (mobile-first)
- ✅ Tailwind CSS + componentes custom
- ✅ Loading spinners
- ✅ Manejo de errores
- ✅ Mensajes de validación
- ✅ Iconos con lucide-react

## 🚀 Cómo Iniciar Desarrollo

### 1. Instalar Dependencias
```bash
cd frontend
npm install
```

### 2. Configurar Variables de Entorno
```bash
# Copiar template
cp .env.example .env

# El .env.example ya tiene la URL del backend correcta:
# VITE_API_URL=http://localhost:5000/api
```

### 3. Iniciar Servidor de Desarrollo
```bash
npm run dev
```

El servidor abrirá automáticamente en `http://localhost:5173`

## 📝 Rutas de la Aplicación

```
/                    → Página de inicio (público)
/auth               → Login/Registro (público)
/notes              → Listar apuntes públicos (público)
/notes/:id          → Detalle de apunte (público)
/create             → Crear apunte (protegido)
/my-notes           → Mis apuntes (protegido)
```

## 🔄 Flujo de Datos

### Autenticación
```
LoginForm/RegisterForm 
  → AuthContext (login/register)
  → Guardar token + user en localStorage
  → Interceptor axios agrega token a requests
```

### Apuntes
```
NotesPage/MyNotesPage 
  → useNotes.fetchAllNotes() / fetchUserNotes()
  → API axios → Backend
  → Mostrar en NoteList → NoteCard individual
```

### IA
```
NoteDetailPage 
  → AIGeneratorPanel (3 botones)
  → Seleccionar: summary/flashcards/quiz
  → aiAPI.generate*() → Backend (Claude API)
  → Renderizar: SummaryView / FlashcardView / QuizView
```

## 🎨 Estilos y Tailwind

### Colores Primarios
```javascript
// tailwind.config.js
primary: {
  50: '#f0f9ff',   // Muy claro
  600: '#0284c7',  // Principal
  700: '#0369a1',  // Hover
  900: '#0c4a6e',  // Muy oscuro
}
```

### Componentes Reutilizables
Definidos en `src/styles/index.css`:
- `.btn` / `.btn-primary` / `.btn-secondary` / `.btn-danger`
- `.card` / `.card-hover`
- `.input` / `.textarea`
- `.tag`
- `.spinner`
- `.markdown-content`

## 🛠️ Stack Tecnológico

- **React 18** - Framework UI
- **React Router 6** - Routing
- **Axios** - HTTP client con interceptores
- **Tailwind CSS** - Styling
- **Lucide React** - Iconos
- **React Markdown** - Renderizar Markdown

## 📦 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo (con auto-open)
npm run build    # Build para producción
npm run preview  # Preview del build
npm run lint     # ESLint
```

## 🔐 Autenticación y Seguridad

- **Token JWT** guardado en localStorage
- **Interceptor** en axios que agrega token automáticamente
- **ProtectedRoute** que redirige a `/auth` si no está autenticado
- **Logout** limpia token y user del localStorage

## 🤖 Integración con IA

El panel de generación de IA:
1. Recibe `noteId` como prop
2. Muestra 3 opciones: Resumen, Flashcards, Quiz
3. Llama al backend (`/api/ai/*`)
4. Renderiza el contenido apropiado
5. Soporta caché (si backend devuelve cached content)

## 🐛 Validación de Formularios

### LoginForm
- Email válido
- Contraseña ≥ 6 caracteres

### RegisterForm
- Nombre ≥ 2 caracteres
- Email válido
- Contraseña ≥ 6 caracteres
- Confirmación debe coincidir

### CreateNotePage
- Título requerido
- Contenido requerido

## 📱 Responsive Design

- **Mobile-first** approach
- **Breakpoints**: sm (640px), md (768px), lg (1024px)
- Navbar con hamburger en mobile
- Grid de apuntes: 1 col mobile → 2 cols tablet → 3 cols desktop

## 🎬 Próximos Pasos

1. Verificar que el **backend esté ejecutándose** en `http://localhost:5000`
2. Crear una **cuenta de usuario** en `/auth`
3. **Crear un apunte** en `/create`
4. **Generar contenido de IA** desde el detalle del apunte
5. Probar **flashcards y quiz** interactivas

## ⚙️ Configuración por Entorno

### Desarrollo
```
VITE_API_URL=http://localhost:5000/api
```

### Producción
```
VITE_API_URL=https://api.production.com/api
```

## 📚 Referencias

- [Tailwind CSS Docs](https://tailwindcss.com)
- [React Router Docs](https://reactrouter.com)
- [Lucide Icons](https://lucide.dev)
- [Axios Interceptors](https://axios-http.com/docs/interceptors)

---

**Frontend completamente desarrollado y listo para testing con el backend. ✅**

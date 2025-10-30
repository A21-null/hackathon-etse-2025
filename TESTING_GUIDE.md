# 🧪 Guía de Implementación y Prueba - StudyFlow

## 📱 Opción 1: Pruebas Manuales (Frontend)

### Paso 1: Iniciar la Aplicación
```bash
cd frontend
npm install
npm run dev
```
Abre: `http://localhost:5173`

### Paso 2: Registrar Primer Usuario

1. Click en botón "Inicia Sesión"
2. Click en "Regístrate"
3. Rellena el formulario:
   ```
   Nombre:     Juan García
   Email:      juan@example.com
   Contraseña: Password123!
   Confirmar:  Password123!
   ```
4. Click en "Crear Cuenta"
5. Serás redirigido a `/notes`

### Paso 3: Crear tu Primer Apunte

1. Click en botón "Nuevo Apunte"
2. Rellena los datos:
   ```
   Título: Cálculo Diferencial - Derivadas
   
   Contenido:
   # Derivadas
   
   ## Concepto Básico
   La derivada de una función es la tasa de cambio instantánea.
   
   ## Reglas de Derivación
   
   1. **Regla de la Potencia**: Si f(x) = x^n, entonces f'(x) = n*x^(n-1)
   2. **Regla del Producto**: (u*v)' = u'*v + u*v'
   3. **Regla de la Cadena**: (f∘g)' = f'(g(x)) * g'(x)
   
   ## Ejemplos
   - f(x) = 3x² + 2x + 1 → f'(x) = 6x + 2
   - f(x) = sin(x) → f'(x) = cos(x)
   
   Etiquetas: matemáticas, cálculo, derivadas
   Público: ✓
   ```
3. Click en "Crear Apunte"

### Paso 4: Ver tu Apunte

1. Serás redirigido a `/notes/:id`
2. Verás el contenido markdown renderizado
3. Verás el panel "Generar Material de Estudio"

### Paso 5: Generar Contenido IA

1. **Resumen**: Click en "Generar" bajo "Resumen"
   - Espera a que Claude procese
   - Verás resumen en markdown
   
2. **Flashcards**: Click en "Generar" bajo "Flashcards"
   - Aparecerá tarjeta interactiva
   - Click para voltear
   - Usa flechas para navegar
   
3. **Quiz**: Click en "Generar" bajo "Quiz"
   - Responde preguntas
   - Obtén feedback inmediato
   - Ve resultado final

### Paso 6: Explorar Apuntes Públicos

1. Click en "Apuntes" (en navbar)
2. Verás grid de apuntes públicos
3. Usa buscador: escribe "Cálculo"
4. Usa filtros: click en etiquetas
5. Click en apunte para ver detalle

### Paso 7: Ver tus Apuntes

1. Click en "Mis Apuntes" (en navbar, solo si estás logueado)
2. Verás tus apuntes personales
3. Filtra entre "Todos" y "Públicos"
4. Edita o elimina tus apuntes

---

## 🔌 Opción 2: Pruebas API (Backend)

**Prerequisito**: Backend debe estar corriendo en `http://localhost:5000`

### Registrar Usuario con cURL

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan García",
    "email": "juan@example.com",
    "password": "Password123!"
  }'
```

**Respuesta esperada:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "Juan García",
    "email": "juan@example.com"
  }
}
```

---

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "Password123!"
  }'
```

---

### Obtener Usuario Actual

```bash
TOKEN="eyJhbGciOiJIUzI1NiIs..."

curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

---

### Crear Apunte

```bash
TOKEN="eyJhbGciOiJIUzI1NiIs..."

curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Cálculo Diferencial - Derivadas",
    "content": "# Derivadas\n\n## Concepto Básico\nLa derivada de una función es la tasa de cambio instantánea.\n\n## Reglas de Derivación\n\n1. **Regla de la Potencia**: Si f(x) = x^n, entonces f'\''(x) = n*x^(n-1)\n2. **Regla del Producto**: (u*v)'\'' = u'\''*v + u*v'\''\n3. **Regla de la Cadena**: (f∘g)'\'' = f'\''(g(x)) * g'\''(x)",
    "tags": ["matemáticas", "cálculo", "derivadas"],
    "isPublic": true
  }'
```

---

### Obtener Todos los Apuntes

```bash
curl -X GET "http://localhost:5000/api/notes?search=cálculo&tags=matemáticas"
```

---

### Obtener Apunte por ID

```bash
curl -X GET http://localhost:5000/api/notes/1
```

---

### Generar Resumen

```bash
TOKEN="eyJhbGciOiJIUzI1NiIs..."

curl -X POST http://localhost:5000/api/ai/summarize \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "noteId": 1
  }'
```

---

### Generar Flashcards

```bash
TOKEN="eyJhbGciOiJIUzI1NiIs..."

curl -X POST http://localhost:5000/api/ai/flashcards \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "noteId": 1
  }'
```

---

### Generar Quiz

```bash
TOKEN="eyJhbGciOiJIUzI1NiIs..."

curl -X POST http://localhost:5000/api/ai/quiz \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "noteId": 1
  }'
```

---

## 🧬 Script de Prueba Automático (Bash)

Crea archivo `test_api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:5000/api"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== TESTING STUDYFLOW API ===${NC}\n"

# 1. Register
echo -e "${BLUE}1. Registering user...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan García",
    "email": "juan@example.com",
    "password": "Password123!"
  }')

TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo -e "${GREEN}✓ User registered. Token: ${TOKEN:0:20}...${NC}\n"

# 2. Create Note
echo -e "${BLUE}2. Creating note...${NC}"
NOTE_RESPONSE=$(curl -s -X POST $BASE_URL/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Cálculo Diferencial - Derivadas",
    "content": "# Derivadas\n\nLa derivada mide la tasa de cambio.",
    "tags": ["matemáticas", "cálculo"],
    "isPublic": true
  }')

NOTE_ID=$(echo $NOTE_RESPONSE | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
echo -e "${GREEN}✓ Note created. ID: $NOTE_ID${NC}\n"

# 3. Get Notes
echo -e "${BLUE}3. Getting all notes...${NC}"
curl -s -X GET "$BASE_URL/notes" | jq '.' | head -20
echo -e "${GREEN}✓ Notes retrieved${NC}\n"

# 4. Get Note by ID
echo -e "${BLUE}4. Getting note by ID...${NC}"
curl -s -X GET "$BASE_URL/notes/$NOTE_ID" | jq '.'
echo -e "${GREEN}✓ Note retrieved${NC}\n"

# 5. Generate Summary
echo -e "${BLUE}5. Generating summary...${NC}"
curl -s -X POST $BASE_URL/ai/summarize \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"noteId\": $NOTE_ID}" | jq '.'
echo -e "${GREEN}✓ Summary generated${NC}\n"

echo -e "${GREEN}=== ALL TESTS COMPLETED ===${NC}"
```

**Ejecutar:**
```bash
chmod +x test_api.sh
./test_api.sh
```

---

## 📊 Usuarios de Prueba Predefinidos

| Nombre | Email | Contraseña | Rol |
|--------|-------|------------|-----|
| Juan García | juan@example.com | Password123! | Estudiante |
| María López | maria@example.com | Password123! | Estudiante |
| Carlos Rodríguez | carlos@example.com | Password123! | Estudiante |

---

## 🎓 Apuntes de Prueba Predefinidos

| Título | Etiquetas | Público | Generador IA |
|--------|-----------|---------|--------------|
| Cálculo Diferencial - Derivadas | matemáticas, cálculo | ✓ | Resumen, Flashcards, Quiz |
| Biología Celular - Estructura | biología, células | ✓ | Resumen, Flashcards |
| Revolución Francesa | historia, revolución | ✓ | Resumen, Quiz |
| Python - Estructuras de Datos | programación, python | ✓ | Resumen, Flashcards |
| Economía - Conceptos Básicos | economía, finanzas | ✗ | (privado) |

---

## ✅ Checklist de Pruebas Completo

### Autenticación
- [ ] Registrar usuario nuevo
- [ ] Login con credenciales correctas
- [ ] Login con credenciales incorrectas (error)
- [ ] Logout y limpiar token
- [ ] Acceder a ruta protegida sin token (redirige a /auth)
- [ ] Obtener usuario actual

### Apuntes - CRUD
- [ ] Crear apunte público
- [ ] Crear apunte privado
- [ ] Listar todos los apuntes públicos
- [ ] Listar apuntes del usuario actual
- [ ] Obtener apunte por ID
- [ ] Editar apunte propio
- [ ] Intentar editar apunte ajeno (error 403)
- [ ] Eliminar apunte propio
- [ ] Intentar eliminar apunte ajeno (error 403)

### Búsqueda y Filtrado
- [ ] Buscar apuntes por título
- [ ] Filtrar apuntes por etiqueta individual
- [ ] Filtrar por múltiples etiquetas
- [ ] Búsqueda y filtro combinados
- [ ] Búsqueda que no retorna resultados

### Contenido IA
- [ ] Generar resumen (Claude API)
- [ ] Generar flashcards (JSON parsing)
- [ ] Generar quiz (JSON parsing)
- [ ] Ver historial de generaciones
- [ ] Eliminar contenido generado
- [ ] Intentar generar con token inválido (error)

### UI/UX
- [ ] Formularios validan campos requeridos
- [ ] Mensajes de error se muestran correctamente
- [ ] Spinners de carga durante peticiones
- [ ] Markdown se renderiza correctamente
- [ ] Flashcards flip animation funciona
- [ ] Quiz feedback inmediato funciona
- [ ] Diseño responsive en mobile
- [ ] Diseño responsive en tablet
- [ ] Diseño responsive en desktop

### Edge Cases
- [ ] Contenido con caracteres especiales
- [ ] Apuntes muy largos (5000+ caracteres)
- [ ] Muchas etiquetas (10+)
- [ ] Markdown con sintaxis compleja
- [ ] Usuario intenta acceder a nota eliminada
- [ ] Concurrencia (múltiples usuarios)

---

## 📝 Datos de Prueba Listos para Copiar

### Registro
```
Nombre:     Juan García
Email:      juan@example.com
Contraseña: Password123!
```

### Crear Apunte
```
Título: Cálculo Diferencial - Derivadas
Contenido: (ver TEST_DATA.md)
Etiquetas: matemáticas, cálculo, derivadas
Público: Sí
```

---

## 🎯 Siguientes Pasos

1. ✅ **Frontend completado** → Listo para usar
2. ⏳ **Backend necesario** → Implementar endpoints
3. ✅ **Datos de prueba** → Ya disponibles (este documento)
4. 📊 **Pruebas manuales** → Usar guía anterior
5. 🚀 **Deployment** → Cuando todo funcione

---

**¡Ahora tienes todo lo necesario para probar StudyFlow! 🎉**

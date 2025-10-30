# ⚡ Comandos Finales para Iniciar StudyFlow Backend

## ✅ Lo que YA está COMPLETADO

Todo el código del backend está implementado al 100%:
- ✅ 11 endpoints REST API
- ✅ Autenticación JWT
- ✅ Integración con Claude API
- ✅ Sistema de caché
- ✅ Base de datos PostgreSQL diseñada
- ✅ Dependencias instaladas (220 paquetes)
- ✅ `.env` configurado con tu API key
- ✅ Documentación completa

---

## 🚀 Comandos para Ejecutar (EN ORDEN)

### 1. Iniciar PostgreSQL

```bash
cd /home/mpereiroc/.local/share/Trash/files/equipo-3
sudo docker-compose up -d
```

**Verificar que está corriendo:**
```bash
sudo docker-compose ps
```

Deberías ver:
```
NAME                  COMMAND              STATUS
studyflow_postgres    postgres             Up
studyflow_pgadmin     /entrypoint.sh       Up
```

---

### 2. Sincronizar Base de Datos (Crear Tablas)

```bash
cd /home/mpereiroc/.local/share/Trash/files/equipo-3/backend
npm run db:sync
```

Verás:
```
✅ PostgreSQL connected successfully
✅ Database models synchronized
```

Esto crea las 3 tablas:
- `users` (id, name, email, password, created_at, updated_at)
- `notes` (id, title, content, author_id, tags, is_public, created_at, updated_at)
- `generated_contents` (id, note_id, type, content, created_at)

---

### 3. Iniciar el Servidor Backend

```bash
cd /home/mpereiroc/.local/share/Trash/files/equipo-3/backend
npm run dev
```

Verás:
```
🚀 StudyFlow Backend Server
📡 Server running on http://localhost:5000
🌍 Environment: development
🗄️  Database: studyflow
🔑 JWT configured: ✅
🤖 Claude API configured: ✅
```

¡El servidor está corriendo! Deja esta terminal abierta.

---

### 4. Probar que Funciona (en otra terminal)

**Health check:**
```bash
curl http://localhost:5000/health
```

**Registrar usuario:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Usuario Prueba",
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
      "name": "Usuario Prueba",
      "email": "test@studyflow.com",
      "createdAt": "...",
      "updatedAt": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Guarda el token** de la respuesta (lo necesitarás para crear apuntes).

---

### 5. Crear un Apunte de Prueba

Reemplaza `TU_TOKEN_AQUI` con el token que recibiste:

```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "title": "Introducción a la Física Cuántica",
    "content": "La mecánica cuántica es la rama de la física que estudia el comportamiento de la materia y la energía a escalas muy pequeñas. Los principios fundamentales incluyen: el principio de incertidumbre de Heisenberg, la dualidad onda-partícula, y el principio de superposición. La función de onda describe el estado cuántico de un sistema. Los observables cuánticos son representados por operadores hermíticos.",
    "tags": ["física", "cuántica", "ciencia"],
    "isPublic": true
  }'
```

---

### 6. Generar Contenido con IA

**Generar resumen:**
```bash
curl -X POST http://localhost:5000/api/ai/summarize \
  -H "Content-Type: application/json" \
  -d '{"noteId": 1}'
```

**Generar flashcards:**
```bash
curl -X POST http://localhost:5000/api/ai/flashcards \
  -H "Content-Type: application/json" \
  -d '{"noteId": 1}'
```

**Generar quiz:**
```bash
curl -X POST http://localhost:5000/api/ai/quiz \
  -H "Content-Type: application/json" \
  -d '{"noteId": 1}'
```

---

### 7. Listar Apuntes

```bash
curl http://localhost:5000/api/notes
```

Con búsqueda:
```bash
curl "http://localhost:5000/api/notes?search=física&tags=cuántica"
```

---

## 📊 Acceder a pgAdmin (Interfaz Visual)

1. Abre tu navegador: **http://localhost:5050**

2. Login:
   - Email: `admin@studyflow.com`
   - Password: `admin`

3. Agregar servidor PostgreSQL:
   - Click derecho en "Servers" → Create → Server
   - General tab:
     - Name: `StudyFlow`
   - Connection tab:
     - Host name: `postgres`
     - Port: `5432`
     - Database: `studyflow`
     - Username: `admin`
     - Password: `password123`

4. Ya puedes explorar las tablas visualmente

---

## 🔧 Comandos Útiles

### Ver logs de Docker
```bash
sudo docker-compose logs -f postgres
```

### Reiniciar PostgreSQL
```bash
sudo docker-compose restart postgres
```

### Detener todo
```bash
sudo docker-compose down
```

### Ver contenedores corriendo
```bash
sudo docker ps
```

### Resetear base de datos (¡BORRA TODO!)
```bash
cd backend
npm run db:reset
```

---

## 🐛 Si algo falla...

### Error: "Cannot connect to PostgreSQL"
```bash
# Ver si PostgreSQL está corriendo
sudo docker-compose ps

# Reiniciar
sudo docker-compose restart postgres

# Ver logs
sudo docker-compose logs postgres
```

### Error: "Port 5432 already in use"
```bash
# Ver qué está usando el puerto
sudo lsof -i :5432

# Si es PostgreSQL local, detenerlo
sudo service postgresql stop
```

### Error: "Module not found"
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

---

## 📁 Archivos Importantes

```
/home/mpereiroc/.local/share/Trash/files/equipo-3/
├── backend/
│   ├── .env                  ← Tu API key de Claude está aquí
│   ├── server.js             ← Servidor principal
│   ├── README.md             ← Documentación completa
│   ├── QUICK_START.md        ← Guía rápida
│   ├── STATUS.md             ← Estado del proyecto
│   └── src/                  ← Todo el código
├── docker-compose.yml        ← Configuración PostgreSQL
├── SETUP_INSTRUCTIONS.md     ← Guía detallada
├── COMANDOS_FINALES.md       ← Este archivo
└── start-backend.sh          ← Script automático (opcional)
```

---

## 🎯 Resumen de 3 Comandos

Si quieres iniciar todo rápido:

```bash
# 1. Iniciar PostgreSQL
cd /home/mpereiroc/.local/share/Trash/files/equipo-3 && sudo docker-compose up -d

# 2. Crear tablas
cd backend && npm run db:sync

# 3. Iniciar servidor
npm run dev
```

---

## ✅ Checklist

Marca cuando completes cada paso:

- [ ] PostgreSQL iniciado (`sudo docker-compose up -d`)
- [ ] Tablas creadas (`npm run db:sync`)
- [ ] Servidor corriendo (`npm run dev`)
- [ ] Health check funciona (`curl localhost:5000/health`)
- [ ] Usuario registrado (probado con curl)
- [ ] Apunte creado (probado con curl)
- [ ] Resumen IA generado (probado con curl)
- [ ] Flashcards generadas (probadas con curl)
- [ ] Quiz generado (probado con curl)

---

## 🎉 ¡Listo!

Una vez completados estos pasos, tu backend estará **100% funcional** con:
- ✅ API REST completa
- ✅ Autenticación JWT
- ✅ Base de datos PostgreSQL
- ✅ Integración con Claude AI
- ✅ Sistema de caché
- ✅ 11 endpoints funcionando

**Próximo paso:** Conectar el frontend React (está en `/frontend`)

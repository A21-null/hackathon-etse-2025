# ⚡ Quick Start - StudyFlow Backend

## 🚦 Comandos para Iniciar (en orden)

### 1. Iniciar PostgreSQL
```bash
cd /home/mpereiroc/.local/share/Trash/files/equipo-3
sudo docker-compose up -d
```

### 2. Verificar que PostgreSQL está corriendo
```bash
sudo docker-compose ps
```

Deberías ver:
```
NAME                  STATUS
studyflow_postgres    Up
studyflow_pgadmin     Up
```

### 3. Sincronizar Base de Datos (crear tablas)
```bash
cd backend
npm run db:sync
```

Verás mensajes como:
```
✅ PostgreSQL connected successfully
✅ Database models synchronized
```

### 4. Iniciar el servidor backend
```bash
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

### 5. Probar que funciona
En otra terminal:
```bash
curl http://localhost:5000/health
```

---

## 🧪 Probar con un Usuario de Prueba

### Registrar usuario
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@studyflow.com",
    "password": "password123"
  }'
```

**Guarda el token** de la respuesta.

### Crear un apunte
```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "title": "Introducción a la Física Cuántica",
    "content": "La mecánica cuántica es la rama de la física que estudia el comportamiento de la materia y la energía a escalas muy pequeñas. Los principios fundamentales incluyen: el principio de incertidumbre de Heisenberg, la dualidad onda-partícula, y el principio de superposición. La función de onda describe el estado cuántico de un sistema.",
    "tags": ["física", "cuántica", "ciencia"],
    "isPublic": true
  }'
```

### Generar resumen con IA
```bash
curl -X POST http://localhost:5000/api/ai/summarize \
  -H "Content-Type: application/json" \
  -d '{"noteId": 1}'
```

### Generar flashcards
```bash
curl -X POST http://localhost:5000/api/ai/flashcards \
  -H "Content-Type: application/json" \
  -d '{"noteId": 1}'
```

### Generar quiz
```bash
curl -X POST http://localhost:5000/api/ai/quiz \
  -H "Content-Type: application/json" \
  -d '{"noteId": 1}'
```

---

## 🔧 Solución Rápida de Problemas

### Docker: Permission denied
```bash
# Opción 1: Usar sudo
sudo docker-compose up -d

# Opción 2: Agregar tu usuario al grupo docker
sudo usermod -aG docker $USER
newgrp docker
```

### Puerto 5432 en uso
```bash
# Ver qué está usando el puerto
sudo lsof -i :5432

# Detener PostgreSQL local
sudo service postgresql stop
```

### Error: Cannot connect to database
```bash
# Reiniciar contenedores
sudo docker-compose restart

# Ver logs
sudo docker-compose logs postgres
```

### Resetear todo (¡cuidado!)
```bash
# Detener y eliminar todo
sudo docker-compose down -v

# Volver a iniciar
sudo docker-compose up -d
cd backend
npm run db:reset
```

---

## 📊 Acceder a pgAdmin

1. Abre: http://localhost:5050
2. Login:
   - Email: `admin@studyflow.com`
   - Password: `admin`
3. Agregar servidor:
   - Host: `postgres`
   - Port: `5432`
   - Database: `studyflow`
   - Username: `admin`
   - Password: `password123`

---

## ✅ Todo Listo!

Una vez que veas este mensaje, el backend está funcionando:

```
🚀 StudyFlow Backend Server
📡 Server running on http://localhost:5000
```

Ahora puedes:
- ✅ Conectar el frontend
- ✅ Probar los endpoints
- ✅ Generar contenido con IA

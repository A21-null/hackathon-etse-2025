# 🚀 Production Deployment Guide

Complete guide for deploying StudyFlow to production.

---

## 📋 Pre-Deployment Checklist

### Security
- [ ] Generate new `JWT_SECRET` (use `openssl rand -base64 32`)
- [ ] Never commit `.env` files to Git
- [ ] Use environment variables on hosting platform
- [ ] Enable HTTPS/SSL
- [ ] Set `NODE_ENV=production`
- [ ] Review and update CORS origins
- [ ] Secure database credentials

### Performance
- [ ] Run production build: `npm run build`
- [ ] Test production build locally
- [ ] Optimize images and assets
- [ ] Enable gzip compression
- [ ] Set up CDN for static assets (optional)

### Monitoring
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Configure logging service
- [ ] Set up uptime monitoring
- [ ] Configure analytics
- [ ] Monitor Claude API usage

---

## 🔧 Option 1: Deploy to Railway (Recommended)

Railway provides easy deployment with PostgreSQL included.

### Backend Deployment

1. **Create Railway Account**
   - Go to https://railway.app/
   - Sign up with GitHub

2. **Create New Project**
   ```
   New Project → Deploy from GitHub repo
   ```

3. **Add PostgreSQL**
   ```
   New → Database → PostgreSQL
   ```
   Railway will automatically create a database and provide connection details.

4. **Configure Backend Service**
   - Select your repository
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`

5. **Set Environment Variables**

   Go to Variables tab and add:
   ```bash
   NODE_ENV=production
   PORT=5000

   # Database (Railway provides these automatically)
   DB_HOST=${{Postgres.PGHOST}}
   DB_PORT=${{Postgres.PGPORT}}
   DB_NAME=${{Postgres.PGDATABASE}}
   DB_USER=${{Postgres.PGUSER}}
   DB_PASSWORD=${{Postgres.PGPASSWORD}}

   # JWT (Generate new secret!)
   JWT_SECRET=YOUR_NEW_SECRET_HERE
   JWT_EXPIRES_IN=7d

   # Claude API
   CLAUDE_API_KEY=your-claude-api-key-here

   # Frontend URL (will be set after frontend deployment)
   FRONTEND_URL=https://your-frontend.vercel.app
   PRODUCTION_FRONTEND_URL=https://your-frontend.vercel.app
   ```

6. **Deploy**
   - Railway will automatically deploy
   - Get your backend URL: `https://your-app.railway.app`

7. **Initialize Database**

   After first deployment, run migrations:
   ```bash
   # Use Railway CLI or connect to PostgreSQL
   railway run npm run db:sync
   ```

### Frontend Deployment

1. **Deploy to Vercel**
   - Go to https://vercel.com/
   - Sign up with GitHub
   - New Project → Import your repository

2. **Configure Project**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```

3. **Set Environment Variables**
   ```bash
   VITE_API_URL=https://your-backend.railway.app/api
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy
   - Get your frontend URL: `https://your-frontend.vercel.app`

5. **Update Backend CORS**

   Go back to Railway and update backend environment variables:
   ```bash
   FRONTEND_URL=https://your-frontend.vercel.app
   PRODUCTION_FRONTEND_URL=https://your-frontend.vercel.app
   ```

---

## 🔧 Option 2: Deploy to Render

Render offers free tier with PostgreSQL.

### Backend + Database

1. **Create Render Account**
   - Go to https://render.com/
   - Sign up with GitHub

2. **Create PostgreSQL Database**
   ```
   New → PostgreSQL
   Name: studyflow-db
   Plan: Free
   ```
   Copy the "Internal Database URL"

3. **Create Web Service**
   ```
   New → Web Service
   Connect your repository
   ```

4. **Configure Service**
   ```
   Name: studyflow-backend
   Region: Choose closest to you
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

5. **Environment Variables**
   ```bash
   NODE_ENV=production
   PORT=10000

   # Database (from Render PostgreSQL)
   DATABASE_URL=postgresql://...  # Or individual vars
   DB_HOST=...
   DB_PORT=5432
   DB_NAME=...
   DB_USER=...
   DB_PASSWORD=...

   JWT_SECRET=your-new-secret
   JWT_EXPIRES_IN=7d
   CLAUDE_API_KEY=your-api-key
   FRONTEND_URL=https://your-frontend.vercel.app
   PRODUCTION_FRONTEND_URL=https://your-frontend.vercel.app
   ```

6. **Deploy**

### Frontend

Same as Railway → use Vercel (recommended) or Netlify

---

## 🔧 Option 3: Deploy to Heroku

Traditional PaaS option.

### Prerequisites
```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login
```

### Backend Deployment

```bash
cd backend

# Create Heroku app
heroku create studyflow-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
heroku config:set JWT_EXPIRES_IN=7d
heroku config:set CLAUDE_API_KEY=your-api-key
heroku config:set FRONTEND_URL=https://your-frontend.vercel.app

# Deploy
git push heroku main

# Initialize database
heroku run npm run db:sync
```

### Frontend

Deploy to Vercel or Netlify as described above.

---

## 🗄️ Database Migration Strategy

### For Production Use Migrations (Not Sync)

1. **Install Sequelize CLI**
   ```bash
   cd backend
   npm install --save-dev sequelize-cli
   ```

2. **Initialize Migrations**
   ```bash
   npx sequelize-cli init
   ```

3. **Create Initial Migration**
   ```bash
   npx sequelize-cli migration:generate --name create-initial-schema
   ```

4. **Edit Migration File**

   In `migrations/XXXXXX-create-initial-schema.js`:
   ```javascript
   module.exports = {
     up: async (queryInterface, Sequelize) => {
       // Create users table
       await queryInterface.createTable('users', {
         id: {
           type: Sequelize.INTEGER,
           primaryKey: true,
           autoIncrement: true
         },
         name: {
           type: Sequelize.STRING,
           allowNull: false
         },
         email: {
           type: Sequelize.STRING,
           unique: true,
           allowNull: false
         },
         password: {
           type: Sequelize.STRING,
           allowNull: false
         },
         created_at: {
           type: Sequelize.DATE,
           allowNull: false
         },
         updated_at: {
           type: Sequelize.DATE,
           allowNull: false
         }
       });

       // Add more tables...
     },

     down: async (queryInterface, Sequelize) => {
       await queryInterface.dropTable('users');
       // Drop other tables...
     }
   };
   ```

5. **Run Migrations**
   ```bash
   npx sequelize-cli db:migrate
   ```

6. **Add to package.json**
   ```json
   {
     "scripts": {
       "migrate": "sequelize-cli db:migrate",
       "migrate:undo": "sequelize-cli db:migrate:undo"
     }
   }
   ```

---

## 🔒 Environment Variables Reference

### Backend Production Variables

```bash
# Server
NODE_ENV=production
PORT=5000

# Database (from hosting provider)
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=your-db-name
DB_USER=your-db-user
DB_PASSWORD=your-db-password

# JWT (Generate new!)
JWT_SECRET=YOUR_NEW_SECRET_32_CHARS_MIN
JWT_EXPIRES_IN=7d

# Claude API
CLAUDE_API_KEY=sk-ant-api03-...

# CORS
FRONTEND_URL=https://your-frontend-domain.com
PRODUCTION_FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend Production Variables

```bash
VITE_API_URL=https://your-backend-domain.com/api
```

---

## 📊 Post-Deployment Verification

### 1. Backend Health Check

```bash
curl https://your-backend-domain.com/health
```

Expected:
```json
{
  "status": "ok",
  "timestamp": "...",
  "uptime": 123.45,
  "environment": "production"
}
```

### 2. Test Authentication

```bash
# Register
curl -X POST https://your-backend-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'

# Login
curl -X POST https://your-backend-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### 3. Test CORS

Open browser console on your frontend and check for CORS errors.

### 4. Test AI Features

Create a note and test all three AI generation types.

---

## 📈 Monitoring & Maintenance

### Error Tracking with Sentry

1. **Install Sentry**
   ```bash
   npm install @sentry/node @sentry/tracing
   ```

2. **Configure in server.js**
   ```javascript
   import * as Sentry from "@sentry/node";

   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
     tracesSampleRate: 1.0,
   });

   // Add before your routes
   app.use(Sentry.Handlers.requestHandler());
   app.use(Sentry.Handlers.tracingHandler());

   // Add before other error handlers
   app.use(Sentry.Handlers.errorHandler());
   ```

### Logging

Use a service like:
- Papertrail
- Loggly
- Datadog
- CloudWatch (AWS)

### Uptime Monitoring

- UptimeRobot (free)
- Pingdom
- StatusCake
- New Relic

### Claude API Monitoring

Check usage daily at https://console.anthropic.com/

Set up alerts when usage reaches:
- 50% of budget → Warning
- 80% of budget → Critical
- 90% of budget → Stop service

---

## 🔄 Continuous Deployment

### GitHub Actions (Automatic Deployment)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd backend && npm install
      - run: cd backend && npm test  # if you have tests
      # Add deployment steps for your platform

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm install
      - run: cd frontend && npm run build
      # Vercel/Netlify auto-deploy handles this
```

---

## 🛡️ Security Best Practices

### Backend
- ✅ Use HTTPS only
- ✅ Set secure JWT secret (32+ chars)
- ✅ Enable rate limiting
- ✅ Use helmet.js for security headers
- ✅ Validate all inputs
- ✅ Sanitize database queries
- ✅ Keep dependencies updated
- ✅ Don't expose error stack traces in production

### Frontend
- ✅ Don't store sensitive data in localStorage
- ✅ Use HTTPS only
- ✅ Implement CSP headers
- ✅ Validate user inputs
- ✅ Keep dependencies updated

### Database
- ✅ Use strong passwords
- ✅ Enable SSL connections
- ✅ Regular backups
- ✅ Limit database access
- ✅ Use read replicas for scaling

---

## 📦 Backup Strategy

### Database Backups

**Automated (Railway/Render):**
- Both platforms automatically backup databases
- Railway: Daily backups included
- Render: Point-in-time recovery available

**Manual Backup:**
```bash
# Export database
pg_dump -h your-host -U your-user -d your-db > backup.sql

# Import database
psql -h your-host -U your-user -d your-db < backup.sql
```

### Environment Variables Backup

Keep a secure backup of all environment variables in a password manager or secure vault.

---

## 🎯 Performance Optimization

### Backend
- ✅ Enable gzip compression
- ✅ Use connection pooling (already configured)
- ✅ Add Redis for caching (optional)
- ✅ Optimize database queries
- ✅ Add database indices (already done)

### Frontend
- ✅ Code splitting (Vite handles this)
- ✅ Lazy loading routes
- ✅ Optimize images
- ✅ Use CDN for static assets
- ✅ Enable browser caching

---

## 💰 Cost Estimation

### Monthly Costs (Approximate)

**Free Tier Option:**
- Railway/Render PostgreSQL: $0 (free tier)
- Railway/Render Backend: $0-5 (free with limits)
- Vercel Frontend: $0 (free tier)
- **Total: $0-5/month + Claude API usage**

**Production Option:**
- Railway PostgreSQL: $5-10/month
- Railway Backend: $5-10/month
- Vercel Pro: $20/month (if needed)
- Claude API: Based on usage
- Monitoring (Sentry): $26/month (optional)
- **Total: $10-66/month + Claude API**

**Claude API Budget:**
- Initial: $40 for hackathon
- Production: Monitor and scale as needed
- With caching: ~43,000 requests possible

---

## 📞 Support & Help

### Platform-Specific Docs
- Railway: https://docs.railway.app/
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- Heroku: https://devcenter.heroku.com/

### Project Docs
- See `LAUNCH.md` for local setup
- See `README_FINAL.md` for project overview
- See `CLAUDE.md` for architecture details

---

**Deployment complete! Your StudyFlow app is now live! 🎉**

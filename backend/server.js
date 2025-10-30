import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './src/config/database.js';
import { validateJwtConfig } from './src/config/jwt.js';
import { validateClaudeConfig } from './src/config/claude.js';

// Import models to register associations
import './src/models/index.js';

// Import routes
import authRoutes from './src/routes/auth.routes.js';
import notesRoutes from './src/routes/notes.routes.js';
import aiRoutes from './src/routes/ai.routes.js';

// Import middleware
import { errorHandler, notFound } from './src/middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Validate configuration
try {
  validateJwtConfig();
  validateClaudeConfig();
} catch (error) {
  console.error('❌ Configuration error:', error.message);
  process.exit(1);
}

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/ai', aiRoutes);

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// Database connection and server start
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Sync models (creates tables if they don\'t exist)
    // In production, use migrations instead of sync
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Database models synchronized');

    // Start server
    app.listen(PORT, () => {
      console.log('');
      console.log('🚀 StudyFlow Backend Server');
      console.log(`📡 Server running on http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  Database: ${process.env.DB_NAME || 'studyflow'}`);
      console.log(`🔑 JWT configured: ${process.env.JWT_SECRET ? '✅' : '❌'}`);
      console.log(`🤖 Claude API configured: ${process.env.CLAUDE_API_KEY ? '✅' : '❌'}`);
      console.log('');
      console.log('📚 API Endpoints:');
      console.log(`   POST   /api/auth/register`);
      console.log(`   POST   /api/auth/login`);
      console.log(`   GET    /api/auth/me`);
      console.log(`   GET    /api/notes`);
      console.log(`   POST   /api/notes`);
      console.log(`   GET    /api/notes/:id`);
      console.log(`   PUT    /api/notes/:id`);
      console.log(`   DELETE /api/notes/:id`);
      console.log(`   POST   /api/ai/summarize`);
      console.log(`   POST   /api/ai/flashcards`);
      console.log(`   POST   /api/ai/quiz`);
      console.log(`   GET    /api/ai/history/:noteId`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Shutting down gracefully...');
  await sequelize.close();
  console.log('✅ Database connection closed');
  process.exit(0);
});

// Start the server
startServer();

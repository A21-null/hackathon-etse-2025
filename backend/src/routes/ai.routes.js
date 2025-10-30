import express from 'express';
import { body } from 'express-validator';
import {
  generateSummary,
  generateFlashcards,
  generateQuiz,
  getGenerationHistory,
  deleteGeneratedContent
} from '../controllers/ai.controller.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

// Validation rules
const generateValidation = [
  body('noteId')
    .notEmpty().withMessage('noteId is required')
    .isInt({ min: 1 }).withMessage('noteId must be a positive integer')
];

// Routes
router.post('/summarize', generateValidation, validate, generateSummary);
router.post('/flashcards', generateValidation, validate, generateFlashcards);
router.post('/quiz', generateValidation, validate, generateQuiz);
router.get('/history/:noteId', optionalAuth, getGenerationHistory);
router.delete('/:id', authenticateToken, deleteGeneratedContent);

export default router;

import express from 'express';
import { body } from 'express-validator';
import {
  generateSummary,
  generateFlashcards,
  generateQuiz,
  generateShortAnswer,
  gradeShortAnswer,
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

const gradeValidation = [
  body('question').notEmpty().withMessage('question is required'),
  body('rubric').notEmpty().withMessage('rubric is required'),
  body('modelAnswer').notEmpty().withMessage('modelAnswer is required'),
  body('studentAnswer').notEmpty().withMessage('studentAnswer is required')
];

// Routes
router.post('/summarize', generateValidation, validate, generateSummary);
router.post('/flashcards', generateValidation, validate, generateFlashcards);
router.post('/quiz', generateValidation, validate, generateQuiz);
router.post('/shortanswer', generateValidation, validate, generateShortAnswer);
router.post('/grade', gradeValidation, validate, gradeShortAnswer);
router.get('/history/:noteId', optionalAuth, getGenerationHistory);
router.delete('/:id', authenticateToken, deleteGeneratedContent);

export default router;

import express from 'express';
import { body } from 'express-validator';
import {
  getAllNotes,
  getNoteById,
  getNotesByUserId,
  createNote,
  updateNote,
  deleteNote
} from '../controllers/notes.controller.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.middleware.js';
import { validate, sanitizeNote } from '../middleware/validation.middleware.js';

const router = express.Router();

// Validation rules
const noteValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 500 }).withMessage('Title must be between 3 and 500 characters'),
  body('content')
    .trim()
    .notEmpty().withMessage('Content is required')
    .isLength({ min: 10, max: 100000 }).withMessage('Content must be between 10 and 100,000 characters'),
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
  body('isPublic')
    .optional()
    .isBoolean().withMessage('isPublic must be a boolean')
];

const updateNoteValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 500 }).withMessage('Title must be between 3 and 500 characters'),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 10, max: 100000 }).withMessage('Content must be between 10 and 100,000 characters'),
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
  body('isPublic')
    .optional()
    .isBoolean().withMessage('isPublic must be a boolean')
];

// Routes
router.get('/', optionalAuth, getAllNotes);                    // GET /api/notes
router.get('/user/:userId', optionalAuth, getNotesByUserId);   // GET /api/notes/user/:userId
router.get('/:id', optionalAuth, getNoteById);                 // GET /api/notes/:id
router.post('/', authenticateToken, sanitizeNote, noteValidation, validate, createNote);  // POST /api/notes
router.put('/:id', authenticateToken, sanitizeNote, updateNoteValidation, validate, updateNote);  // PUT /api/notes/:id
router.delete('/:id', authenticateToken, deleteNote);          // DELETE /api/notes/:id

export default router;

import express from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
  getCommentsByNote,
  createComment,
  updateComment,
  deleteComment,
  getCommentCount
} from '../controllers/comments.controller.js';

const router = express.Router();

/**
 * @route   GET /api/comments/note/:noteId
 * @desc    Get all comments for a note (public)
 * @access  Public
 */
router.get('/note/:noteId', getCommentsByNote);

/**
 * @route   GET /api/comments/note/:noteId/count
 * @desc    Get comment count for a note
 * @access  Public
 */
router.get('/note/:noteId/count', getCommentCount);

/**
 * @route   POST /api/comments
 * @desc    Create a new comment or reply
 * @access  Private (requires authentication)
 */
router.post(
  '/',
  authenticateToken,
  [
    body('noteId').isInt().withMessage('Valid note ID is required'),
    body('content')
      .trim()
      .notEmpty().withMessage('Comment content is required')
      .isLength({ min: 1, max: 2000 }).withMessage('Comment must be between 1 and 2000 characters'),
    body('parentId').optional().isInt().withMessage('Parent ID must be an integer')
  ],
  validate,
  createComment
);

/**
 * @route   PUT /api/comments/:id
 * @desc    Update a comment
 * @access  Private (only comment author)
 */
router.put(
  '/:id',
  authenticateToken,
  [
    body('content')
      .trim()
      .notEmpty().withMessage('Comment content is required')
      .isLength({ min: 1, max: 2000 }).withMessage('Comment must be between 1 and 2000 characters')
  ],
  validate,
  updateComment
);

/**
 * @route   DELETE /api/comments/:id
 * @desc    Delete a comment
 * @access  Private (comment author or note owner)
 */
router.delete('/:id', authenticateToken, deleteComment);

export default router;

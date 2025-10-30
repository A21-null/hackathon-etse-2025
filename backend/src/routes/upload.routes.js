import express from 'express';
import upload from '../config/multer.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { uploadFile, deleteFile, getFile } from '../controllers/upload.controller.js';

const router = express.Router();

/**
 * @route   POST /api/upload
 * @desc    Upload a PDF file
 * @access  Private
 */
router.post('/', authenticateToken, upload.single('file'), uploadFile);

/**
 * @route   DELETE /api/upload/:filename
 * @desc    Delete an uploaded file
 * @access  Private
 */
router.delete('/:filename', authenticateToken, deleteFile);

/**
 * @route   GET /api/upload/:filename
 * @desc    Get/download an uploaded file
 * @access  Public
 */
router.get('/:filename', getFile);

export default router;

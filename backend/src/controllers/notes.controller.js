import { Op } from 'sequelize';
import { Note, User, GeneratedContent } from '../models/index.js';

// Get all public notes (with pagination and search)
export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, tags } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause
    const where = { isPublic: true };

    // Search by title or content
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Filter by tags
    if (tags) {
      const tagArray = tags.split(',').map(t => t.trim());
      where.tags = { [Op.overlap]: tagArray };
    }

    const { count, rows } = await Note.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        notes: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get note by ID
export const getNoteById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const note = await Note.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email']
        },
        {
          model: GeneratedContent,
          as: 'generatedContents',
          attributes: ['id', 'type', 'createdAt']
        }
      ]
    });

    if (!note) {
      return res.status(404).json({
        error: 'Note not found'
      });
    }

    // Check if note is public or user is the author
    if (!note.isPublic && (!req.user || req.user.id !== note.authorId)) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { note }
    });
  } catch (error) {
    next(error);
  }
};

// Get notes by user ID
export const getNotesByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    // Only show public notes unless requesting own notes
    const where = { authorId: userId };
    if (!req.user || req.user.id !== parseInt(userId)) {
      where.isPublic = true;
    }

    const { count, rows } = await Note.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        notes: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create new note (protected)
export const createNote = async (req, res, next) => {
  try {
    const { title, content, tags, isPublic = true } = req.body;

    const note = await Note.create({
      title,
      content,
      tags: tags || [],
      isPublic,
      authorId: req.user.id
    });

    // Load author data
    await note.reload({
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: { note }
    });
  } catch (error) {
    next(error);
  }
};

// Update note (protected, author only)
export const updateNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, tags, isPublic } = req.body;

    const note = await Note.findByPk(id);

    if (!note) {
      return res.status(404).json({
        error: 'Note not found'
      });
    }

    // Check if user is the author
    if (note.authorId !== req.user.id) {
      return res.status(403).json({
        error: 'You are not authorized to update this note'
      });
    }

    // Update fields
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (tags !== undefined) note.tags = tags;
    if (isPublic !== undefined) note.isPublic = isPublic;

    await note.save();

    // Reload with author
    await note.reload({
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.json({
      success: true,
      message: 'Note updated successfully',
      data: { note }
    });
  } catch (error) {
    next(error);
  }
};

// Delete note (protected, author only)
export const deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;

    const note = await Note.findByPk(id);

    if (!note) {
      return res.status(404).json({
        error: 'Note not found'
      });
    }

    // Check if user is the author
    if (note.authorId !== req.user.id) {
      return res.status(403).json({
        error: 'You are not authorized to delete this note'
      });
    }

    await note.destroy();

    res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

import { Comment, User, Note } from '../models/index.js';

/**
 * Get all comments for a note (with nested replies)
 * GET /api/comments/note/:noteId
 */
export const getCommentsByNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    // Verify note exists and is public
    const note = await Note.findByPk(noteId);
    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }

    if (!note.isPublic) {
      return res.status(403).json({
        success: false,
        error: 'Comments are only available for public notes'
      });
    }

    // Get all top-level comments (parentId is null) with their replies
    const comments = await Comment.findAll({
      where: {
        noteId,
        parentId: null
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Comment,
          as: 'replies',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ],
      order: [
        ['createdAt', 'DESC'],
        [{ model: Comment, as: 'replies' }, 'createdAt', 'ASC']
      ]
    });

    res.json({
      success: true,
      data: {
        noteId: parseInt(noteId),
        count: comments.length,
        comments
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new comment or reply
 * POST /api/comments
 * Body: { noteId, content, parentId? }
 */
export const createComment = async (req, res, next) => {
  try {
    const { noteId, content, parentId } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!noteId || !content) {
      return res.status(400).json({
        success: false,
        error: 'Note ID and content are required'
      });
    }

    // Verify note exists and is public
    const note = await Note.findByPk(noteId);
    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }

    if (!note.isPublic) {
      return res.status(403).json({
        success: false,
        error: 'Can only comment on public notes'
      });
    }

    // If replying to a comment, verify parent exists
    if (parentId) {
      const parentComment = await Comment.findByPk(parentId);
      if (!parentComment) {
        return res.status(404).json({
          success: false,
          error: 'Parent comment not found'
        });
      }

      // Verify parent comment belongs to the same note
      if (parentComment.noteId !== parseInt(noteId)) {
        return res.status(400).json({
          success: false,
          error: 'Parent comment does not belong to this note'
        });
      }
    }

    // Create comment
    const comment = await Comment.create({
      noteId,
      content,
      authorId: userId,
      parentId: parentId || null
    });

    // Fetch the created comment with author info
    const createdComment = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: parentId ? 'Reply added successfully' : 'Comment added successfully',
      data: { comment: createdComment }
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message
      });
    }
    next(error);
  }
};

/**
 * Update a comment
 * PUT /api/comments/:id
 * Body: { content }
 */
export const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Content is required'
      });
    }

    // Find comment
    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }

    // Check if user is the author
    if (comment.authorId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only edit your own comments'
      });
    }

    // Update comment
    comment.content = content;
    await comment.save();

    // Fetch updated comment with author info
    const updatedComment = await Comment.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Comment updated successfully',
      data: { comment: updatedComment }
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message
      });
    }
    next(error);
  }
};

/**
 * Delete a comment
 * DELETE /api/comments/:id
 */
export const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find comment
    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }

    // Check if user is the author or the note owner
    const note = await Note.findByPk(comment.noteId);
    if (comment.authorId !== userId && note.authorId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only delete your own comments or comments on your notes'
      });
    }

    // Delete comment (replies will be cascade deleted)
    await comment.destroy();

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get comment count for a note
 * GET /api/comments/note/:noteId/count
 */
export const getCommentCount = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const count = await Comment.count({
      where: { noteId }
    });

    res.json({
      success: true,
      data: {
        noteId: parseInt(noteId),
        count
      }
    });
  } catch (error) {
    next(error);
  }
};

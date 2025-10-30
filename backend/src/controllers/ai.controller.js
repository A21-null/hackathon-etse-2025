import { callClaude, parseClaudeJSON } from '../services/claude.service.js';
import { PROMPTS, validateContentLength } from '../utils/prompts.js';
import { Note, GeneratedContent } from '../models/index.js';

/**
 * Generate summary from note content
 */
export const generateSummary = async (req, res, next) => {
  try {
    const { noteId } = req.body;

    // Find note
    const note = await Note.findByPk(noteId);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Validate content length
    validateContentLength(note.content);

    // Check cache first (to save API costs)
    const existing = await GeneratedContent.findOne({
      where: { noteId, type: 'summary' },
      order: [['createdAt', 'DESC']]
    });

    if (existing) {
      console.log('✅ Using cached summary');
      return res.json({
        success: true,
        cached: true,
        data: existing
      });
    }

    // Generate with Claude
    const prompt = PROMPTS.summarize(note.content);
    const summary = await callClaude(prompt.user, prompt.system);

    // Save to database
    const generated = await GeneratedContent.create({
      noteId,
      type: 'summary',
      content: { text: summary }
    });

    res.json({
      success: true,
      cached: false,
      message: 'Summary generated successfully',
      data: generated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate flashcards from note content
 */
export const generateFlashcards = async (req, res, next) => {
  try {
    const { noteId } = req.body;

    // Find note
    const note = await Note.findByPk(noteId);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Validate content length
    validateContentLength(note.content);

    // Check cache first
    const existing = await GeneratedContent.findOne({
      where: { noteId, type: 'flashcards' },
      order: [['createdAt', 'DESC']]
    });

    if (existing) {
      console.log('✅ Using cached flashcards');
      return res.json({
        success: true,
        cached: true,
        data: existing
      });
    }

    // Generate with Claude
    const prompt = PROMPTS.flashcards(note.content);
    const flashcardsText = await callClaude(prompt.user, prompt.system);

    // Parse JSON response
    const flashcards = parseClaudeJSON(flashcardsText);

    // Validate structure
    if (!Array.isArray(flashcards) || flashcards.length === 0) {
      throw new Error('Invalid flashcards format from Claude');
    }

    // Save to database
    const generated = await GeneratedContent.create({
      noteId,
      type: 'flashcards',
      content: { cards: flashcards }
    });

    res.json({
      success: true,
      cached: false,
      message: 'Flashcards generated successfully',
      data: generated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate quiz from note content
 */
export const generateQuiz = async (req, res, next) => {
  try {
    const { noteId } = req.body;

    // Find note
    const note = await Note.findByPk(noteId);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Validate content length
    validateContentLength(note.content);

    // Check cache first
    const existing = await GeneratedContent.findOne({
      where: { noteId, type: 'quiz' },
      order: [['createdAt', 'DESC']]
    });

    if (existing) {
      console.log('✅ Using cached quiz');
      return res.json({
        success: true,
        cached: true,
        data: existing
      });
    }

    // Generate with Claude
    const prompt = PROMPTS.quiz(note.content);
    const quizText = await callClaude(prompt.user, prompt.system);

    // Parse JSON response
    const quiz = parseClaudeJSON(quizText);

    // Validate structure
    if (!Array.isArray(quiz) || quiz.length === 0) {
      throw new Error('Invalid quiz format from Claude');
    }

    // Save to database
    const generated = await GeneratedContent.create({
      noteId,
      type: 'quiz',
      content: { questions: quiz }
    });

    res.json({
      success: true,
      cached: false,
      message: 'Quiz generated successfully',
      data: generated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get generation history for a note
 */
export const getGenerationHistory = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    // Check if note exists
    const note = await Note.findByPk(noteId);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Get all generated content for this note
    const history = await GeneratedContent.findAll({
      where: { noteId },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        noteId: parseInt(noteId),
        history
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete generated content by ID
 */
export const deleteGeneratedContent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const content = await GeneratedContent.findByPk(id, {
      include: [{
        model: Note,
        as: 'note',
        attributes: ['authorId']
      }]
    });

    if (!content) {
      return res.status(404).json({ error: 'Generated content not found' });
    }

    // Only author can delete
    if (content.note.authorId !== req.user.id) {
      return res.status(403).json({
        error: 'You are not authorized to delete this content'
      });
    }

    await content.destroy();

    res.json({
      success: true,
      message: 'Generated content deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

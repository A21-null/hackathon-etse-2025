import User from './User.js';
import Note from './Note.js';
import GeneratedContent from './GeneratedContent.js';
import Comment from './Comment.js';

// Define relationships

// User has many Notes
User.hasMany(Note, {
  foreignKey: 'authorId',
  as: 'notes',
  onDelete: 'CASCADE'
});

// Note belongs to User
Note.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author'
});

// Note has many GeneratedContents
Note.hasMany(GeneratedContent, {
  foreignKey: 'noteId',
  as: 'generatedContents',
  onDelete: 'CASCADE'
});

// GeneratedContent belongs to Note
GeneratedContent.belongsTo(Note, {
  foreignKey: 'noteId',
  as: 'note'
});

// User has many Comments
User.hasMany(Comment, {
  foreignKey: 'authorId',
  as: 'comments',
  onDelete: 'CASCADE'
});

// Comment belongs to User (author)
Comment.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author'
});

// Note has many Comments
Note.hasMany(Comment, {
  foreignKey: 'noteId',
  as: 'comments',
  onDelete: 'CASCADE'
});

// Comment belongs to Note
Comment.belongsTo(Note, {
  foreignKey: 'noteId',
  as: 'note'
});

// Comment has many Comments (replies)
Comment.hasMany(Comment, {
  foreignKey: 'parentId',
  as: 'replies',
  onDelete: 'CASCADE'
});

// Comment belongs to Comment (parent)
Comment.belongsTo(Comment, {
  foreignKey: 'parentId',
  as: 'parent'
});

export { User, Note, GeneratedContent, Comment };

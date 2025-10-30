import User from './User.js';
import Note from './Note.js';
import GeneratedContent from './GeneratedContent.js';

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

export { User, Note, GeneratedContent };

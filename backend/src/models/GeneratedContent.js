import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const GeneratedContent = sequelize.define('GeneratedContent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  noteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'note_id',
    references: {
      model: 'notes',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  type: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['summary', 'flashcards', 'quiz', 'shortanswer']]
    }
  },
  content: {
    type: DataTypes.JSONB,  // JSONB for PostgreSQL
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
}, {
  tableName: 'generated_contents',
  timestamps: true,
  underscored: true,
  updatedAt: false,  // Solo created_at
  indexes: [
    {
      fields: ['note_id']
    },
    {
      fields: ['type']
    },
    {
      fields: ['note_id', 'type'],
      unique: false
    },
    {
      using: 'GIN',
      fields: ['content']
    }
  ]
});

export default GeneratedContent;

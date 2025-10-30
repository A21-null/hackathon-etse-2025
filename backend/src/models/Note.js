import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Note = sequelize.define('Note', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 500]
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [10, 100000]  // Mínimo 10 caracteres, máximo 100k
    }
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'author_id',
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    defaultValue: [],
    validate: {
      isArrayOfStrings(value) {
        if (!Array.isArray(value)) {
          throw new Error('Tags must be an array');
        }
        if (value.some(tag => typeof tag !== 'string')) {
          throw new Error('All tags must be strings');
        }
      }
    }
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_public'
  },
  attachments: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of PDF file attachments with metadata: [{filename, originalName, path, size, uploadedAt}]'
  }
}, {
  tableName: 'notes',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['author_id']
    },
    {
      fields: ['created_at']
    },
    {
      using: 'GIN',
      fields: ['tags']
    }
  ]
});

export default Note;

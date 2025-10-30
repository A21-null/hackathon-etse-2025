import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Comment content cannot be empty'
      },
      len: {
        args: [1, 2000],
        msg: 'Comment must be between 1 and 2000 characters'
      }
    }
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
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'parent_id',
    references: {
      model: 'comments',
      key: 'id'
    },
    onDelete: 'CASCADE',
    comment: 'For replies to comments - null if top-level comment'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'updated_at'
  }
}, {
  tableName: 'comments',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['note_id']
    },
    {
      fields: ['author_id']
    },
    {
      fields: ['parent_id']
    },
    {
      fields: ['note_id', 'parent_id']
    },
    {
      fields: ['created_at']
    }
  ]
});

export default Comment;

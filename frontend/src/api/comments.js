import api from './axios';

/**
 * Get all comments for a note
 * @param {number} noteId - The note ID
 * @returns {Promise} - Comments data
 */
export const getCommentsByNote = async (noteId) => {
  const response = await api.get(`/comments/note/${noteId}`);
  return response.data;
};

/**
 * Get comment count for a note
 * @param {number} noteId - The note ID
 * @returns {Promise} - Comment count
 */
export const getCommentCount = async (noteId) => {
  const response = await api.get(`/comments/note/${noteId}/count`);
  return response.data;
};

/**
 * Create a new comment
 * @param {object} commentData - { noteId, content, parentId? }
 * @returns {Promise} - Created comment
 */
export const createComment = async (commentData) => {
  const response = await api.post('/comments', commentData);
  return response.data;
};

/**
 * Update a comment
 * @param {number} commentId - The comment ID
 * @param {string} content - New content
 * @returns {Promise} - Updated comment
 */
export const updateComment = async (commentId, content) => {
  const response = await api.put(`/comments/${commentId}`, { content });
  return response.data;
};

/**
 * Delete a comment
 * @param {number} commentId - The comment ID
 * @returns {Promise} - Success message
 */
export const deleteComment = async (commentId) => {
  const response = await api.delete(`/comments/${commentId}`);
  return response.data;
};

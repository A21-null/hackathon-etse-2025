import api from './axios';

export const notesAPI = {
  // Get all public notes
  getAllNotes: async (params = {}) => {
    const response = await api.get('/notes', { params });
    return response.data;
  },

  // Get note by ID
  getNoteById: async (id) => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  // Get notes by user ID
  getNotesByUserId: async (userId, params = {}) => {
    const response = await api.get(`/notes/user/${userId}`, { params });
    return response.data;
  },

  // Create new note
  createNote: async (noteData) => {
    const response = await api.post('/notes', noteData);
    return response.data;
  },

  // Update note
  updateNote: async (id, noteData) => {
    const response = await api.put(`/notes/${id}`, noteData);
    return response.data;
  },

  // Delete note
  deleteNote: async (id) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },
};

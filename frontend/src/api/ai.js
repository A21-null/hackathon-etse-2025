import api from './axios';

export const aiAPI = {
  // Generate summary
  generateSummary: async (noteId) => {
    const response = await api.post('/ai/summarize', { noteId });
    return response.data;
  },

  // Generate flashcards
  generateFlashcards: async (noteId) => {
    const response = await api.post('/ai/flashcards', { noteId });
    return response.data;
  },

  // Generate quiz
  generateQuiz: async (noteId) => {
    const response = await api.post('/ai/quiz', { noteId });
    return response.data;
  },

  // Get generation history
  getHistory: async (noteId) => {
    const response = await api.get(`/ai/history/${noteId}`);
    return response.data;
  },

  // Delete generated content
  deleteContent: async (id) => {
    const response = await api.delete(`/ai/${id}`);
    return response.data;
  },
};

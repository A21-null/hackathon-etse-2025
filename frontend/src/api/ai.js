import api from './axios';

export const aiAPI = {
  // Generate summary
  generateSummary: async (noteId) => {
    const response = await api.post('/ai/summarize', { noteId });
    // Backend returns {success, cached, data: {content}}
    return response.data.data || response.data;
  },

  // Generate flashcards
  generateFlashcards: async (noteId) => {
    const response = await api.post('/ai/flashcards', { noteId });
    // Backend returns {success, cached, data: {content}}
    return response.data.data || response.data;
  },

  // Generate quiz
  generateQuiz: async (noteId) => {
    const response = await api.post('/ai/quiz', { noteId });
    // Backend returns {success, cached, data: {content}}
    return response.data.data || response.data;
  },

  // Generate short answer questions
  generateShortAnswer: async (noteId) => {
    const response = await api.post('/ai/shortanswer', { noteId });
    // Backend returns {success, cached, data: {content}}
    return response.data.data || response.data;
  },

  // Grade short answer
  gradeShortAnswer: async (question, rubric, modelAnswer, studentAnswer) => {
    const response = await api.post('/ai/grade', {
      question,
      rubric,
      modelAnswer,
      studentAnswer
    });
    return response.data.data || response.data;
  },

  // Get generation history
  getHistory: async (noteId) => {
    const response = await api.get(`/ai/history/${noteId}`);
    return response.data.data || response.data;
  },

  // Delete generated content
  deleteContent: async (id) => {
    const response = await api.delete(`/ai/${id}`);
    return response.data;
  },
};

import api from './axios';

export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    // Backend returns {success, message, data: {user, token}}
    return response.data.data || response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    // Backend returns {success, message, data: {user, token}}
    return response.data.data || response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    // Backend returns {success, data: {user}}
    return response.data.data || response.data;
  },
};

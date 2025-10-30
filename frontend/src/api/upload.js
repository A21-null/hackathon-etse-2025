import api from './axios';

export const uploadAPI = {
  // Upload a PDF file
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Backend returns {success, message, data: {file}}
    return response.data.data || response.data;
  },

  // Delete an uploaded file
  deleteFile: async (filename) => {
    const response = await api.delete(`/upload/${filename}`);
    return response.data;
  },

  // Get file URL
  getFileUrl: (filename) => {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    return `${baseURL}/upload/${filename}`;
  },
};

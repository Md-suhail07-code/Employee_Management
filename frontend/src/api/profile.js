import axios from 'axios';

const API_URL = 'http://localhost:8080/api/profile';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const profileService = {
  getProfile: async () => {
    const response = await axios.get(API_URL, { headers: getAuthHeader() });
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await axios.put(API_URL, data, { headers: getAuthHeader() });
    return response.data;
  },

  updatePassword: async (data) => {
    const response = await axios.put(`${API_URL}/password`, data, { headers: getAuthHeader() });
    return response.data;
  },

  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_URL}/avatar`, formData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteAvatar: async () => {
    const response = await axios.delete(`${API_URL}/avatar`, { headers: getAuthHeader() });
    return response.data;
  },

  deleteProfile: async () => {
    const response = await axios.delete(API_URL, { headers: getAuthHeader() });
    return response.data;
  },
};

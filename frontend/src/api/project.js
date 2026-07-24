import axios from 'axios';

const API_URL = 'http://localhost:8080/api/projects';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const projectService = {
  getAll: async () => {
    const response = await axios.get(API_URL, { headers: getAuthHeader() });
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() });
    return response.data;
  },

  create: async (projectData) => {
    const response = await axios.post(API_URL, projectData, { headers: getAuthHeader() });
    return response.data;
  },

  update: async (id, projectData) => {
    const response = await axios.put(`${API_URL}/${id}`, projectData, { headers: getAuthHeader() });
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
    return response.data;
  },

  search: async (keyword) => {
    const response = await axios.get(`${API_URL}/search?keyword=${keyword}`, { headers: getAuthHeader() });
    return response.data;
  }
};
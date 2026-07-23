import axios from 'axios';

const API_URL = 'http://localhost:8080/api/employees';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const employeeService = {
  getAll: async () => {
    const response = await axios.get(API_URL, { headers: getAuthHeader() });
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() });
    return response.data;
  },

  create: async (employeeData) => {
    const response = await axios.post(API_URL, employeeData, { headers: getAuthHeader() });
    return response.data;
  },

  update: async (id, employeeData) => {
    const response = await axios.put(`${API_URL}/${id}`, employeeData, { headers: getAuthHeader() });
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
    return response.data;
  }
};
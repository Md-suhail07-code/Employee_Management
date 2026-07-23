import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/auth';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  register: async (name, email, password) => {
    const response = await apiClient.post('/register', {
      name,
      email,
      password,
      role: 'ADMIN',
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await apiClient.post('/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
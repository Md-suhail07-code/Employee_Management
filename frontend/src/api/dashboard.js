import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const dashboardService = {
  getStats: async () => {
    const response = await axios.get(`${API_BASE}/dashboard`, { headers: getAuthHeader() });
    return response.data;
  },
  
  getSummaryReport: async () => {
    const response = await axios.get(`${API_BASE}/reports/summary`, { headers: getAuthHeader() });
    return response.data;
  }
};
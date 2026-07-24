import axios from 'axios';

const API_URL = 'http://localhost:8080/api/employee/dashboard';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const employeeDashboardService = {
  getMetrics: async () => {
    const response = await axios.get(API_URL, { headers: getAuthHeader() });
    return response.data;
  }
};
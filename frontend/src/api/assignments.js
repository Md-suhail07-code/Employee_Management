import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const assignmentService = {
  getAssignedEmployees: async (projectId) => {
    const response = await axios.get(`${API_BASE}/projects/${projectId}/employees`, { headers: getAuthHeader() });
    return response.data;
  },

  getUnassignedEmployees: async (projectId) => {
    const response = await axios.get(`${API_BASE}/projects/${projectId}/unassigned-employees`, { headers: getAuthHeader() });
    return response.data;
  },

  assign: async (projectId, employeeId) => {
    const response = await axios.post(`${API_BASE}/projects/${projectId}/employees/${employeeId}`, {}, { headers: getAuthHeader() });
    return response.data;
  },

  remove: async (projectId, employeeId) => {
    const response = await axios.delete(`${API_BASE}/projects/${projectId}/employees/${employeeId}`, { headers: getAuthHeader() });
    return response.data;
  }
};
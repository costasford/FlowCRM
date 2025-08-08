import axios from 'axios';
import { tokenStorage } from './tokenStorage';
import { 
  isDemoMode,
  demoAuthAPI,
  demoCompaniesAPI,
  demoContactsAPI,
  demoDealsAPI,
  demoTasksAPI,
  demoActivitiesAPI,
  demoUsersAPI,
  demoLeadScoresAPI
} from './demoApi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout for better user experience
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = tokenStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors and token cleanup
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token and redirect to login
      tokenStorage.removeToken();
      
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Smart API layer - automatically switches between demo and real APIs
const createSmartAPI = (realAPI, demoAPI) => {
  return new Proxy(realAPI, {
    get: (target, prop) => {
      if (isDemoMode()) {
        return demoAPI[prop] || target[prop];
      }
      return target[prop];
    }
  });
};

// Real API implementations
const realAuthAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  getCurrentUser: () => api.get('/users/me'),
};

const realUsersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  activate: (id) => api.put(`/users/${id}/activate`),
  deactivate: (id) => api.put(`/users/${id}/deactivate`),
  delete: (id) => api.delete(`/users/${id}`),
};

const realCompaniesAPI = {
  getAll: (params) => api.get('/companies', { params }),
  getById: (id) => api.get(`/companies/${id}`),
  create: (companyData) => api.post('/companies', companyData),
  update: (id, companyData) => api.put(`/companies/${id}`, companyData),
  delete: (id) => api.delete(`/companies/${id}`),
};

const realContactsAPI = {
  getAll: (params) => api.get('/contacts', { params }),
  getById: (id) => api.get(`/contacts/${id}`),
  create: (contactData) => api.post('/contacts', contactData),
  update: (id, contactData) => api.put(`/contacts/${id}`, contactData),
  delete: (id) => api.delete(`/contacts/${id}`),
  getLeadScores: () => api.get('/contacts/lead-scores'),
};

const realDealsAPI = {
  getAll: (params) => api.get('/deals', { params }),
  getById: (id) => api.get(`/deals/${id}`),
  create: (dealData) => api.post('/deals', dealData),
  update: (id, dealData) => api.put(`/deals/${id}`, dealData),
  updateStage: (id, stage) => api.put(`/deals/${id}/stage`, { stage }),
  delete: (id) => api.delete(`/deals/${id}`),
  getPipeline: () => api.get('/deals/pipeline'),
};

const realTasksAPI = {
  getAll: (params) => api.get('/tasks', { params }),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (taskData) => api.post('/tasks', taskData),
  update: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  complete: (id) => api.put(`/tasks/${id}/complete`),
  delete: (id) => api.delete(`/tasks/${id}`),
  getDashboard: () => api.get('/tasks/dashboard'),
};

const realActivitiesAPI = {
  getAll: (params) => api.get('/activities', { params }),
  getById: (id) => api.get(`/activities/${id}`),
  create: (activityData) => api.post('/activities', activityData),
  update: (id, activityData) => api.put(`/activities/${id}`, activityData),
  delete: (id) => api.delete(`/activities/${id}`),
  getTimeline: (params) => api.get('/activities/timeline', { params }),
};

const realLeadScoresAPI = {
  getAll: (params) => api.get('/leadscores', { params }),
  getById: (id) => api.get(`/leadscores/${id}`),
  getByContact: (contactId) => api.get(`/leadscores/contact/${contactId}`),
  create: (scoreData) => api.post('/leadscores', scoreData),
  update: (id, scoreData) => api.put(`/leadscores/${id}`, scoreData),
  updateByContact: (contactId, scoreData) => api.put(`/leadscores/contact/${contactId}`, scoreData),
  recalculate: () => api.post('/leadscores/recalculate'),
  getAnalytics: () => api.get('/leadscores/analytics'),
  delete: (id) => api.delete(`/leadscores/${id}`),
};

// Export smart APIs that automatically switch between demo and real
export const authAPI = createSmartAPI(realAuthAPI, demoAuthAPI);
export const usersAPI = createSmartAPI(realUsersAPI, demoUsersAPI);
export const companiesAPI = createSmartAPI(realCompaniesAPI, demoCompaniesAPI);
export const contactsAPI = createSmartAPI(realContactsAPI, demoContactsAPI);
export const dealsAPI = createSmartAPI(realDealsAPI, demoDealsAPI);
export const tasksAPI = createSmartAPI(realTasksAPI, demoTasksAPI);
export const activitiesAPI = createSmartAPI(realActivitiesAPI, demoActivitiesAPI);
export const leadScoresAPI = createSmartAPI(realLeadScoresAPI, demoLeadScoresAPI);

export default api;
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
  withCredentials: true, // Include cookies in all requests
});

// No need for Authorization header with HttpOnly cookies
// Cookies are automatically included with withCredentials: true

// Professional error handling with user-friendly messages
const getErrorMessage = (error) => {
  // Network errors (server unreachable, DNS issues, etc.)
  if (!error.response) {
    if (error.code === 'ERR_NETWORK') {
      return 'Unable to connect to server. Please check your internet connection and try again.';
    }
    if (error.code === 'ENOTFOUND' || error.message.includes('ENOTFOUND')) {
      return 'Server is currently unavailable. Please try again later.';
    }
    return 'Network error occurred. Please check your connection and try again.';
  }

  // HTTP status errors
  const status = error.response.status;
  const serverMessage = error.response.data?.error || error.response.data?.message;

  switch (status) {
    case 400:
      return serverMessage || 'Invalid request. Please check your input and try again.';
    case 401:
      return 'Invalid email or password. Please try again.';
    case 403:
      return 'Access denied. You don\'t have permission to perform this action.';
    case 404:
      return 'Service not found. Please contact support if this persists.';
    case 409:
      return serverMessage || 'Conflict occurred. This resource may already exist.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
      return 'Server error occurred. Please try again or contact support.';
    case 502:
    case 503:
    case 504:
      return 'Service temporarily unavailable. Please try again in a few minutes.';
    default:
      return serverMessage || `Unexpected error (${status}). Please try again or contact support.`;
  }
};

// Handle auth errors
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    // Add user-friendly error message
    error.userMessage = getErrorMessage(error);
    
    if (error.response?.status === 401) {
      // Logout to clear cookie on server
      await tokenStorage.logout();
      
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

// Connection test utility for fetch-based requests
export const testConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });
    return {
      connected: true,
      status: response.status,
      message: response.status === 401 ? 'Server is responding (authentication endpoint working)' : 'Server connected successfully'
    };
  } catch (error) {
    // Handle fetch-specific errors
    let errorMessage = 'Network error occurred. Please check your connection and try again.';
    
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      errorMessage = 'Unable to connect to server. Please check your internet connection and try again.';
    } else if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
      errorMessage = 'Network error occurred. Please try again later.';
    } else if (error.message) {
      errorMessage = `Connection failed: ${error.message}`;
    }
    
    return {
      connected: false,
      error: errorMessage,
      details: error.message || 'Unknown network error'
    };
  }
};

// Real API implementations
const realAuthAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  getCurrentUser: () => api.get('/users/me'),
  testConnection,
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

// DEBUG: Check demo mode status at module load
console.log('🔧 API Module Loading - Demo Mode Status:', isDemoMode());
console.log('🔧 API Base URL:', API_BASE_URL);
console.log('🔧 Environment VITE_DEMO_MODE:', import.meta.env.VITE_DEMO_MODE);

// TEMPORARY: Force real API to isolate the issue
console.log('🚨 FORCING REAL API - BYPASSING SMART PROXY FOR DEBUGGING');

export const authAPI = realAuthAPI;
export const usersAPI = realUsersAPI;
export const companiesAPI = realCompaniesAPI;
export const contactsAPI = realContactsAPI;
export const dealsAPI = realDealsAPI;
export const tasksAPI = realTasksAPI;
export const activitiesAPI = realActivitiesAPI;
export const leadScoresAPI = realLeadScoresAPI;

export default api;
import axios from 'axios';

// Get the base URL from environment variables
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authentication token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('isAuth');
      localStorage.removeItem('user');
      window.location.href = '/auth/signin';
    }
    return Promise.reject(error);
  }
);

// API endpoints object for better organization
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: '/api/login',
    register: '/api/register',
    oauth: {
      google: '/oauth2/authorization/google',
      github: '/oauth2/authorization/github',
    },
  },
  // Profile
  profile: {
    get: '/api/profile',
    update: '/api/profile',
    changePassword: '/api/profile/change-password',
  },
  // Business
  business: {
    register: '/api/business/register',
    getAll: '/api/business/all',
    delete: (id) => `/api/business/${id}`,
  },
  // Chat (for future use)
  chat: {
    send: '/api/chat',
  },
  // Trip planning
  trip: {
    plan: '/api/trip/plan',
  },
};

// Helper functions for common API calls
export const api = {
  // Authentication
  login: (credentials) => apiClient.post(API_ENDPOINTS.auth.login, credentials),
  register: (userData) => fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.register}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  }),
  
  // Profile
  getProfile: () => apiClient.get(API_ENDPOINTS.profile.get),
  updateProfile: (profileData) => apiClient.put(API_ENDPOINTS.profile.update, profileData),
  changePassword: (passwordData) => apiClient.post(API_ENDPOINTS.profile.changePassword, passwordData),
  
  // Business
  registerBusiness: (businessData) => fetch(`${API_BASE_URL}${API_ENDPOINTS.business.register}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(businessData),
  }),
  getAllBusinesses: () => fetch(`${API_BASE_URL}${API_ENDPOINTS.business.getAll}`),
  deleteBusiness: (id) => fetch(`${API_BASE_URL}${API_ENDPOINTS.business.delete(id)}`, {
    method: 'DELETE',
  }),
  
  // Trip planning
  planTrip: (tripData) => apiClient.post(API_ENDPOINTS.trip.plan, tripData),
};

// OAuth URL helpers
export const getOAuthUrl = (provider) => {
  return `${API_BASE_URL}${API_ENDPOINTS.auth.oauth[provider]}`;
};

export default api;

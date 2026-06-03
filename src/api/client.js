import axios from 'axios';
import StorageService from '../utils/storageService.js';
import ErrorHandler from '../utils/errorHandler.js';

// Simple API client that can run in MOCK mode so the frontend can be
// developed independently of the backend. Switch USE_MOCK to false
// to call real endpoints.
const USE_MOCK = false;
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Add response interceptor to handle auth errors globally
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      ErrorHandler.handleUnauthorized();
    }
    return ErrorHandler.handleError(error);
  }
);

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const client = {
  get: async (url) => {
    if (!USE_MOCK) {
      const token = StorageService.getToken();
      return axios.get(`${BASE_URL}${url}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    await delay(500);
    // Mock for verify-token
    if (url.includes('/verify-token')) {
      const user = StorageService.getUser();
      if (user) {
        return { data: { success: true, data: user } };
      }
    }
    return { data: { success: false } };
  },
  post: async (url, data) => {
    if (!USE_MOCK) {
      const token = StorageService.getToken();
      return axios.post(`${BASE_URL}${url}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Simulate network latency for a more realistic dev experience
    await delay(500);

    // Basic mocked responses for the common endpoints used by the app
    if (url.endsWith('/login') || url.includes('/login')) {
      return {
        data: {
          user: { phone: data.phone },
          token: 'mock-token',
        },
      };
    }

    if (url.endsWith('/signup') || url.includes('/signup')) {
      return {
        data: {
          user: { phone: data.phone, firstname: data.firstname || 'Mock' },
        },
      };
    }

    // Fallback generic mocked response
    return { data: { success: true } };
  },
  put: async (url, data) => {
    if (!USE_MOCK) {
      const token = StorageService.getToken();
      return axios.put(`${BASE_URL}${url}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    await delay(500);
    return { data: { success: true, data } };
  }
};

export default client;

import axios from 'axios';

// Simple API client that can run in MOCK mode so the frontend can be
// developed independently of the backend. Switch USE_MOCK to false
// to call real endpoints.
const USE_MOCK = false;
const BASE_URL = 'http://localhost:5000';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const client = {
  get: async (url) => {
    if (!USE_MOCK) {
      const token = localStorage.getItem('nvcr_tk');
      return axios.get(`${BASE_URL}${url}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    await delay(500);
    // Mock for verify-token
    if (url.includes('/verify-token')) {
      const userData = localStorage.getItem('userData');
      if (userData) {
        return { data: { success: true, data: JSON.parse(userData).user } };
      }
    }
    return { data: { success: false } };
  },
  post: async (url, data) => {
    if (!USE_MOCK) {
      const token = localStorage.getItem('nvcr_tk');
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
      const token = localStorage.getItem('nvcr_tk');
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

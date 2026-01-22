import axios from 'axios';

// Simple API client that can run in MOCK mode so the frontend can be
// developed independently of the backend. Switch USE_MOCK to false
// to call real endpoints.
const USE_MOCK = true;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const client = {
  post: async (url, data) => {
    if (!USE_MOCK) {
      return axios.post(url, data);
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
};

export default client;

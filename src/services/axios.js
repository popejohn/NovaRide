import axios from 'axios';
import StorageService from "../utils/storageService";
import ErrorHandler from "../utils/errorHandler";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = StorageService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => ErrorHandler.handleError(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      ErrorHandler.handleUnauthorized();
    }
    return ErrorHandler.handleError(error);
  }
);

export default api;






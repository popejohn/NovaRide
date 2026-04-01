// Error handling service to separate concerns from API client
import StorageService from './storageService.js';

class ErrorHandler {
  static handleUnauthorized() {
    StorageService.clearAll();
    const publicPaths = ['/', '/login', '/signup', '/forgot-password'];
    const currentPath = window.location.pathname;

    // Only redirect if not on a public path
    if (!publicPaths.includes(currentPath)) {
      window.location.href = '/login';
    }
  }

  static handleError(error) {
    // Add general error handling logic here
    console.error('API Error:', error);
    return Promise.reject(error);
  }
}

export default ErrorHandler;
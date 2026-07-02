// Auth service to handle authentication operations
// Abstracts HTTP calls and state management
import api from '../services/axios';
import StorageService from './storageService.js';
import RoleService from './roleService.js';

class AuthService {
  static async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data.data;

      // Store token
      StorageService.setToken(token);

      return {
        success: true,
        token,
        user,
        role: RoleService.getPredominantRole(user.role)
      };
    } catch (error) {
      throw new Error(error?.response?.data?.message || 'Login failed');
    }
  }

  static async signup(userData) {
    try {
      const response = await api.post('/auth/signup', userData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      throw new Error(error?.response?.data?.message || 'Signup failed');
    }
  }

  static async verifyToken() {
    try {
      const response = await api.get('/auth/verify-token');
      return {
        success: true,
        user: response.data.data
      };
    } catch (error) {
      return { success: false };
    }
  }

  static logout() {
    StorageService.clearAll();
  }
}

export default AuthService;




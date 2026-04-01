// Persistence service to handle storage operations for Redux state
// This abstracts storage logic from Redux slices
import StorageService from './storageService.js';

class PersistenceService {
  static loadUserState() {
    try {
      const userData = StorageService.getUser();
      if (userData) {
        return {
          user: userData.user || null,
          role: userData.role || null,
          isAuthenticated: false, // Force verification on load
          profileCompleted: userData.profileCompleted || false,
          isOnline: userData.isOnline || false,
        };
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
    return {
      user: null,
      role: null,
      isAuthenticated: false,
      profileCompleted: false,
      isOnline: false,
    };
  }

  static saveUserState(state) {
    const userData = {
      user: state.user,
      role: state.role,
      profileCompleted: state.profileCompleted,
      isOnline: state.isOnline,
    };
    StorageService.setUser(userData);
  }

  static clearUserState() {
    StorageService.clearUser();
  }
}

export default PersistenceService;
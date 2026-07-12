// Persistence service to handle storage operations for Redux state
// This abstracts storage logic from Redux slices
// User data is NOT persisted to localStorage — only the JWT token is stored.
// On page refresh, App.jsx re-verifies the token with the backend to restore user state.

class PersistenceService {
  static loadUserState() {
    // Always return empty defaults — user data is fetched fresh from the API
    return {
      user: null,
      role: null,
      isAuthenticated: false,
      profileCompleted: false,
      isOnline: false,
    };
  }

  // No-op: user data must not be written to localStorage
  static saveUserState(_state) {}

  // No-op: nothing to clear for user data
  static clearUserState() {}
}

export default PersistenceService;




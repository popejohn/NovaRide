// Persistence service to handle storage operations for Redux state
// This abstracts storage logic from Redux slices
// User data is NOT persisted to localStorage — only the JWT token is stored.
// On page refresh, App.jsx re-verifies the token with the backend to restore user state.
// The rider's online/go-live status IS persisted so it survives page refreshes.

const ONLINE_STATUS_KEY = 'nvcr_rider_online';

class PersistenceService {
  static loadUserState() {
    // User data is fetched fresh from the API, but rider online status is persisted.
    const isOnline = localStorage.getItem(ONLINE_STATUS_KEY) === 'true';
    return {
      user: null,
      role: null,
      isAuthenticated: false,
      profileCompleted: false,
      isOnline,
    };
  }

  // Persist only the rider's online status — user data must not be written to localStorage
  static saveUserState(state) {
    if (typeof state.isOnline === 'boolean') {
      localStorage.setItem(ONLINE_STATUS_KEY, String(state.isOnline));
    }
  }

  // Clear the online status when the user logs out
  static clearUserState() {
    localStorage.removeItem(ONLINE_STATUS_KEY);
  }
}

export default PersistenceService;




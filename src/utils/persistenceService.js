// Persistence service to handle storage operations for Redux state
// This abstracts storage logic from Redux slices
// The token and a last-known user snapshot persist across refreshes. App.jsx
// always verifies the token before treating the snapshot as authenticated.
// The rider's online/go-live status IS persisted so it survives page refreshes.

const ONLINE_STATUS_KEY = 'nvcr_rider_online';
const USER_STATE_KEY = 'nvcr_user_state';

class PersistenceService {
  static loadUserState() {
    const storedUser = localStorage.getItem(USER_STATE_KEY);
    let user = null;

    try {
      user = storedUser ? JSON.parse(storedUser) : null;
    } catch {
      localStorage.removeItem(USER_STATE_KEY);
    }

    const isOnline = localStorage.getItem(ONLINE_STATUS_KEY) === 'true';
    return {
      user,
      role: user?.role || null,
      isAuthenticated: Boolean(user),
      profileCompleted: Boolean(user?.profileCompleted),
      isOnline,
      isInitializing: true,
    };
  }

  static saveUserState(state) {
    if (state.user) {
      localStorage.setItem(USER_STATE_KEY, JSON.stringify(state.user));
    }
    if (typeof state.isOnline === 'boolean') {
      localStorage.setItem(ONLINE_STATUS_KEY, String(state.isOnline));
    }
  }

  // Clear the online status when the user logs out
  static clearUserState() {
    localStorage.removeItem(ONLINE_STATUS_KEY);
    localStorage.removeItem(USER_STATE_KEY);
  }
}

export default PersistenceService;




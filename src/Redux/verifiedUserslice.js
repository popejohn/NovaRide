import { createSlice } from '@reduxjs/toolkit';
import PersistenceService from '../utils/persistenceService.js';
import RoleService from '../utils/roleService.js';

// Function to load initial state from persistence layer
const loadInitialState = () => {
  const userData = PersistenceService.loadUserState();
  if (userData.user) {
    const originalRoles = userData.user.role;
    const predominantRole = RoleService.getPredominantRole(originalRoles);
    return {
      ...userData,
      role: predominantRole,
    };
  }
  return userData;
};

const initialState = loadInitialState();

export const verifiedUserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      const { user } = action.payload;
      const originalRoles = user?.role;
      const predominantRole = RoleService.getPredominantRole(originalRoles);
      const updatedUser = user ? { ...user, role: originalRoles } : null;

      state.user = updatedUser;
      state.role = predominantRole;
      state.isAuthenticated = true;
      state.profileCompleted = user?.profileCompleted || false;

      // Persist to storage
      PersistenceService.saveUserState(state);
    },
    setOnlineStatus(state, action) {
      state.isOnline = action.payload;
      PersistenceService.saveUserState(state);
    },
    setProfileCompleted(state) {
      state.profileCompleted = true;
      PersistenceService.saveUserState(state);
    },
    logout(state) {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      state.profileCompleted = false;
      state.isOnline = false;
      // Clear storage
      PersistenceService.clearUserState();
      // Note: token clearing should be handled by auth slice or service
    },
  },
});

export const { setUser, setProfileCompleted, logout, setOnlineStatus } = verifiedUserSlice.actions;
export default verifiedUserSlice.reducer;
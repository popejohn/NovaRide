import { createSlice } from '@reduxjs/toolkit';

// Function to load initial state from localStorage
const loadInitialState = () => {
  try {
    const token = localStorage.getItem('nvcr_tk');
    const userData = localStorage.getItem('userData');
    if (token && userData) {
      const parsedUserData = JSON.parse(userData);
      return {
        user: parsedUserData.user,
        role: parsedUserData.role,
        isAuthenticated: false, // Force verification on load
        profileCompleted: parsedUserData.profileCompleted || false,
        isOnline: parsedUserData.isOnline || false,
      };
    }
  } catch (error) {
    console.error('Error loading user data from localStorage:', error);
  }
  return {
    user: null,
    role: null,
    isAuthenticated: false,
    profileCompleted: false,
    isOnline: false,
  };
};

const initialState = loadInitialState();

export const verifiedUserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      const { user } = action.payload;
      state.user = user;
      state.role = user?.role;
      state.isAuthenticated = true;
      state.profileCompleted = user?.profileCompleted || false;
      localStorage.setItem('userData', JSON.stringify({
        user: user,
        role: user?.role,
        profileCompleted: user?.profileCompleted || false,
        isOnline: state.isOnline,
      }));
    },
    setOnlineStatus(state, action) {
      state.isOnline = action.payload;
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      userData.isOnline = action.payload;
      localStorage.setItem('userData', JSON.stringify(userData));
    },
    setProfileCompleted(state) {
      state.profileCompleted = true;
      // Update localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      userData.profileCompleted = true;
      localStorage.setItem('userData', JSON.stringify(userData));
    },
    logout(state) {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      state.profileCompleted = false;
      state.isOnline = false;
      // Clear localStorage
      localStorage.removeItem('userData');
      localStorage.removeItem('nvcr_tk');
    },
  },
});

export const { setUser, setProfileCompleted, logout, setOnlineStatus } = verifiedUserSlice.actions;
export default verifiedUserSlice.reducer;
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
        isAuthenticated: true,
        profileCompleted: parsedUserData.profileCompleted || false,
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
  };
};

const initialState = loadInitialState();

export const verifiedUserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      state.profileCompleted = action.payload.profileCompleted || false;
      // Persist to localStorage
      localStorage.setItem('userData', JSON.stringify({
        user: action.payload.user,
        role: action.payload.role,
        profileCompleted: action.payload.profileCompleted || false,
      }));
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
      // Clear localStorage
      localStorage.removeItem('userData');
      localStorage.removeItem('nvcr_tk');
    },
  },
});

export const {setUser, setProfileCompleted, logout } = verifiedUserSlice.actions;
export default verifiedUserSlice.reducer;
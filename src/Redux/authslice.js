// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = { 
  token: null,       // JWT or session token
  isLoading: false,  // drives “Signing Up…” button text
  error: null,       // last error message, if any
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /* SIGN-UP flow */
    signupStart:  (state) => { state.isLoading = true;  state.error = null; },
    signupSuccess:(state, action) => {
      state.isLoading = false;
    },
    signupFailure:(state, action) => {
      state.isLoading = false;
      state.error = action.payload;          // plain string
    },

    /* LOGIN flow (same idea) */
    loginStart:   (state) => { state.isLoading = true;  state.error = null; },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.token = action.payload.token;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    /* generic */
    logout:       (state) => { Object.assign(state, initialState); },
  },
});

export const {
  signupStart,  signupSuccess,  signupFailure,
  loginStart,   loginSuccess,   loginFailure,
  logout,
} = authSlice.actions;

export default authSlice.reducer;

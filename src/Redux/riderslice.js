// src/redux/slices/rideSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pickupLocation: "",
  destination: "",
  ridersNearby: [],
  selectedRider: null,
  rideCost: null,
};

export const rideSlice = createSlice({
  name: 'ride',
  initialState,
  reducers: {
    setPickupLocation: (state, action) => {
      state.pickupLocation = action.payload;
    },
    setDestination: (state, action) => {
      state.destination = action.payload;
    },
    setRidersNearby: (state, action) => {
      state.ridersNearby = action.payload;
    },
    setSelectedRider: (state, action) => {
      state.selectedRider = action.payload;
    },
    setRideCost: (state, action) => {
      state.rideCost = action.payload;
    },
    resetRide: (state) => {
      state.pickupLocation = null;
      state.destination = null;
      state.ridersNearby = [];
      state.selectedRider = null;
      state.rideCost = null;
    },
  },
});

export const {
  setPickupLocation,
  setDestination,
  setRidersNearby,
  setSelectedRider,
  setRideCost,
  resetRide,
} = rideSlice.actions;

export default rideSlice.reducer;





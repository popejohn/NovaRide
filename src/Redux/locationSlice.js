import { createSlice } from "@reduxjs/toolkit";


const initialState = {
        pickupCoordinate: { lat: null, lng: null },
        destinationCoordinate: { lat: null, lng: null },
};

export const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        setPickupCoordinate: (state, action) => {
            state.pickupCoordinate = action.payload;
        },
        setDestinationCoordinate: (state, action) => {
            state.destinationCoordinate = action.payload;
        },
    },
});

export const { setPickupCoordinate, setDestinationCoordinate } = locationSlice.actions;

export default locationSlice.reducer;





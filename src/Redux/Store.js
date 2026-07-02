import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { authSlice } from './authslice';
import { loaderSlice } from './showslice';
import { verifiedUserSlice } from './verifiedUserslice'
import { rideSlice } from './riderslice';
import { locationSlice } from './locationSlice';

export default configureStore({
    reducer: {
        auth: authSlice.reducer,
        loader: loaderSlice.reducer,
        verifiedUser: verifiedUserSlice.reducer,
        getRide: rideSlice.reducer,
        location: locationSlice.reducer,
    }
});





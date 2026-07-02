import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    loading: false,
}

export const loaderSlice = createSlice({
    name: 'load',
    initialState: initialState,
    reducers: {
        itemLoading: (state) =>{
            state.loading = true
        },
        itemLoaded: (state) =>{
            state.loading = false
        }
        }
    })



export const { itemLoading, itemLoaded } = loaderSlice.actions;
export default loaderSlice.reducer;




import { createSlice } from "@reduxjs/toolkit";

let initialState = null;

const slice = createSlice({
    name: "utilitySlice",
    initialState,
    reducers: {
        UTILITY_SUCCESS: (_state, action) => {
            return action.payload;
        },
        UTILITY_ERROR: () => {
            return null;
        },
    },
});

export const { UTILITY_SUCCESS, UTILITY_ERROR } = slice.actions;
export default slice.reducer;

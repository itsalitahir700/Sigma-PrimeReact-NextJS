import { createSlice } from "@reduxjs/toolkit";

let initialState = [];

const slice = createSlice({
    name: "billSlice",
    initialState,
    reducers: {
        BILL_SUCCESS: (_state, action) => {
            return action.payload;
        },
        BILL_ERROR: () => {
            return [];
        },
    },
});

export const { BILL_SUCCESS, BILL_ERROR } = slice.actions;
export default slice.reducer;

import { createSlice } from "@reduxjs/toolkit";

let initialState = [];

const slice = createSlice({
    name: "paidBillSlice",
    initialState,
    reducers: {
        PAID_BILL_SUCCESS: (_state, action) => {
            return action.payload;
        },
        PAID_BILL_ERROR: () => {
            return [];
        },
    },
});

export const { PAID_BILL_SUCCESS, PAID_BILL_ERROR } = slice.actions;
export default slice.reducer;

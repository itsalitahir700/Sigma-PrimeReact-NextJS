import { createSlice } from "@reduxjs/toolkit";

let initialState = null;

const slice = createSlice({
    name: "walletSlice",
    initialState,
    reducers: {
        WALLET_SUCCESS: (_state, action) => {
            return action.payload;
        },
        WALLET_ERROR: () => {
            return { accountBalance: 0 };
        },
    },
});

export const { WALLET_SUCCESS, WALLET_ERROR } = slice.actions;
export default slice.reducer;

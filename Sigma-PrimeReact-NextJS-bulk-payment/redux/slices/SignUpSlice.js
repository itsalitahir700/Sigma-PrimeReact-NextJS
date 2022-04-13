import { createSlice } from "@reduxjs/toolkit";
import * as cookie from "cookie";

let initialState = null;
if (typeof window !== "undefined") {
    const { auth } = cookie.parse(document.cookie);
    if (auth) initialState = JSON.parse(auth);
}
const slice = createSlice({
    name: "signupSlice",
    initialState,
    reducers: {
        SIGNUP_SUCCESS: (_state, action) => {
            return action.payload;
        },
        SIGNUP_ERROR: () => {
            return null;
        },
    },
});

export const { SIGNUP_SUCCESS, SIGNUP_ERROR } = slice.actions;
export default slice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import * as cookie from "cookie";

let initialState = null;
if (typeof window !== "undefined") {
    const { auth } = cookie.parse(document.cookie);
    if (auth) initialState = JSON.parse(auth);
}
const slice = createSlice({
    name: "authenticationSlice",
    initialState,
    reducers: {
        LOGIN_SUCCESS: (_state, action) => {
            return action.payload;
        },
        LOGIN_ERROR: () => {
            return null;
        },
    },
});

export const { LOGIN_SUCCESS, LOGIN_ERROR } = slice.actions;
export default slice.reducer;

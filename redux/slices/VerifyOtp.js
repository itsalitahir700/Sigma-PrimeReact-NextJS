import { createSlice } from "@reduxjs/toolkit";
import * as cookie from "cookie";

let initialState = null;
if (typeof window !== "undefined") {
    const { auth } = cookie.parse(document.cookie);
    if (auth) initialState = JSON.parse(auth);
}
const slice = createSlice({
    name: "verifyotp",
    initialState,
    reducers: {
        VERIFY_OTP_SUCCESS: (_state, action) => {
            return action.payload;
        },
        VERIFY_OTP_ERROR: () => {
            return null;
        },
    },
});

export const { VERIFY_OTP_SUCCESS, VERIFY_OTP_ERROR } = slice.actions;
export default slice.reducer;
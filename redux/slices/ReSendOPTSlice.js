import { createSlice } from "@reduxjs/toolkit";
import * as cookie from "cookie";

let initialState = null;
if (typeof window !== "undefined") {
    const { auth } = cookie.parse(document.cookie);
    if (auth) initialState = JSON.parse(auth);
}
const slice = createSlice({
    name: "resendotp",
    initialState,
    reducers: {
        OTP_SUCCESS: (_state, action) => {
            return action.payload;
        },
        OTP_ERROR: () => {
            return null;
        },
    },
});

export const { OTP_SUCCESS, OTP_ERROR } = slice.actions;
export default slice.reducer;

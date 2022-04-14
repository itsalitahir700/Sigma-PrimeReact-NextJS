import { createSlice } from "@reduxjs/toolkit";
import * as cookie from "cookie";

let initialState = null;
if (typeof window !== "undefined") {
    const { auth } = cookie.parse(document.cookie);
    if (auth) initialState = JSON.parse(auth);
}
const slice = createSlice({
    name: "createpasswordSlice",
    initialState,
    reducers: {
        CREATE_PASSWORD_SUCCESS: (_state, action) => {
            return action.payload;
        },
        CREATE_PASSWORD_ERROR: () => {
            return null;
        },
    },
});

export const { CREATE_PASSWORD_SUCCESS, CREATE_PASSWORD_ERROR } = slice.actions;
export default slice.reducer;

import { createSlice } from "@reduxjs/toolkit";
const slice = createSlice({
    name: "loading",
    initialState: { loading: false },
    reducers: {
        SETLOADING: (state, action) => {
            state.loading = action.payload;
        },
    },
});
export const { SETLOADING } = slice.actions;
export default slice.reducer;

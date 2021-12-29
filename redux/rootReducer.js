import { combineReducers } from "redux";
import authenticationSlice from "./slices/authenticationSlice";
import utilitySlice from "./slices/utilitySlice";
import billSlice from "./slices/billSlice";
import paidBillSlice from "./slices/paidBillSlice";
import walletSlice from "./slices/walletSlice";

export default combineReducers({
    authenticationSlice,
    utilitySlice,
    billSlice,
    paidBillSlice,
    walletSlice,
});

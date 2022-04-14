import { combineReducers } from "redux";
import authenticationSlice from "./slices/authenticationSlice";
import utilitySlice from "./slices/utilitySlice";
import billSlice from "./slices/billSlice";
import paidBillSlice from "./slices/paidBillSlice";
import walletSlice from "./slices/walletSlice";
import SignUpSlice from "./slices/SignUpSlice";
import ReSendOPTSlice from "./slices/ReSendOPTSlice";
import CreatePasswordSlice from "./slices/CreatePasswordSlice";
import VerifyOtp from "./slices/VerifyOtp";
import loadingSlice from "./slices/loadingSlice";

export default combineReducers({
    authenticationSlice,
    utilitySlice,
    billSlice,
    paidBillSlice,
    walletSlice,
    SignUpSlice,
    ReSendOPTSlice,
    CreatePasswordSlice,
    VerifyOtp,
    loadingSlice,
});

import { login, wallet } from "../../services/Auth";
import { LOGIN_SUCCESS, LOGIN_ERROR } from "../slices/authenticationSlice";
import { SIGNUP_SUCCESS, SIGNUP_ERROR } from "../slices/SignUpSlice";
import { OTP_SUCCESS, OTP_ERROR } from "../slices/ReSendOPTSlice";
import { handlePostRequest } from "../../services/PostRequest";
import { handleGetRequest } from "../../services/GetRequest";
import { CREATE_PASSWORD_SUCCESS, CREATE_PASSWORD_ERROR } from "../slices/CreatePasswordSlice";
import Cookies from "js-cookie";
import { WALLET_ERROR, WALLET_SUCCESS } from "../slices/walletSlice";
import { VERIFY_OTP_SUCCESS, VERIFY_OTP_ERROR } from "../slices/VerifyOtp";
import { handlePutRequest } from "../../services/UpdateRequest";

export const loginAction = (authData) => async (dispatch) => {
    const res = await login(authData);
    if (res) {
        dispatch(LOGIN_SUCCESS(res));
        Cookies.set("auth", JSON.stringify(res));
        localStorage.setItem("auth", JSON.stringify(res));
    } else {
        dispatch(LOGIN_ERROR("Error"));
    }
    return res;
};

export const SignUpAction = (authData) => async (dispatch) => {
    const url = "/zingpay/unsecured/signup";
    const res = await handlePostRequest(authData, url);
    if (res) {
        Cookies.set("accountId", res?.returnId);
        dispatch(SIGNUP_SUCCESS(res));
    } else {
        dispatch(SIGNUP_ERROR("Error"));
    }
    return res;
};

export const CreatePasswordAction = (authData) => async (dispatch) => {
    const url = "/zingpay/unsecured/create-password";
    const res = await handlePutRequest(authData, url);
    if (res) {
        dispatch(CREATE_PASSWORD_SUCCESS(res));
    } else {
        dispatch(CREATE_PASSWORD_ERROR("Error"));
    }
    return res;
};

export const ResendOTPAction = (phoneNumber) => async (dispatch) => {
    const url = `/zingpay/unsecured/resend?cellPhone=${phoneNumber}`;
    const res = await handleGetRequest(url);
    if (res) {
        dispatch(OTP_SUCCESS(res));
    } else {
        dispatch(OTP_ERROR("Error"));
    }
    return res;
};
export const VerifyOTPAction = (data) => async (dispatch) => {
    const url = `/zingpay/unsecured/activate`;
    const res = await handlePutRequest(data, url);
    if (res) {
        dispatch(VERIFY_OTP_SUCCESS(res));
    } else {
        dispatch(VERIFY_OTP_ERROR("Error"));
    }
    return res;
};

export const getWallet = async (token, dispatch) => {
    const res = await wallet(token);
    if (dispatch) {
        if (res) {
            dispatch(WALLET_SUCCESS(res));
        } else {
            dispatch(WALLET_ERROR("Error"));
        }
    }
    return res;
};

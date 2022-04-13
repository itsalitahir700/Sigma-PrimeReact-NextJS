import { login, SignUp, wallet, resentOTP } from "../../services/Auth";
import { LOGIN_SUCCESS, LOGIN_ERROR } from "../slices/authenticationSlice";
import { SIGNUP_SUCCESS, SIGNUP_ERROR } from "../slices/SignUpSlice";
import { OTP_SUCCESS, OTP_ERROR } from "../slices/ReSendOPTSlice";

import Cookies from "js-cookie";
import { WALLET_ERROR, WALLET_SUCCESS } from "../slices/walletSlice";

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
    const res = await SignUp(authData);
    console.log("authData 11", res);
    if (res) {
        dispatch(SIGNUP_SUCCESS(res));
        // Cookies.set("auth", JSON.stringify(res));
        // localStorage.setItem("auth", JSON.stringify(res));
    } else {
        dispatch(SIGNUP_ERROR("Error"));
    }
    return res;
};

export const ResendOTPAction = (phoneNumber) => async (dispatch) => {
    const res = await resentOTP(phoneNumber);
    if (res) {
        dispatch(OTP_SUCCESS(res));
        // Cookies.set("auth", JSON.stringify(res));
        // localStorage.setItem("auth", JSON.stringify(res));
    } else {
        dispatch(OTP_ERROR("Error"));
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

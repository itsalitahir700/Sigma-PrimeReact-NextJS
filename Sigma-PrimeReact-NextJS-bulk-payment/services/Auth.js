import axios from "axios";
import { toast } from "react-toastify";
import { auth, baseURL } from "../utils/constants";

export const login = async ({ username, password, deviceId }) => {
    let res = false;
    await axios({
        method: "post",
        url: `${baseURL}/auth/authentication?password=${password}&username=${username}&deviceId=${deviceId}&application=CBA`,
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            res = response.data.additionalDetail;
            if (response.data.code < 20001 || response.data.code > 25000) throw response.data.message;
            // toast.success(response.data.message);
        })
        .catch((err) => {
            toast.warn(err || "Something went wrong");
        });
    return res;
};

export const SignUp = async (authData) => {
    let res = false;
    await axios({
        method: "post",
        url: `${baseURL}/zingpay/unsecured/signup`,
        data: authData,
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            return (res = response.data);
            // if (response.data.code < 20001 || response.data.code > 25000) throw response.data.message;
            // toast.success(response.data.message);
        })
        .catch((err) => {
            toast.warn(err || "Something went wrong");
        });
    console.log("authData in sign up", res);

    return res;
};

export const resentOTP = async (authData) => {
    let res = false;
    await axios({
        method: "get",
        url: `${baseURL}/zingpay/unsecured/resend?cellPhone=${authData}`,
        data: authData,
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            return (res = response.data);
            // if (response.data.code < 20001 || response.data.code > 25000) throw response.data.message;
            // toast.success(response.data.message);
        })
        .catch((err) => {
            toast.warn(err || "Something went wrong");
        });
    console.log("resentOTP", res);

    return res;
};

export const wallet = async (token) => {
    let res = false;
    await axios({
        url: `${baseURL}/zingpay/wallet`,
        headers: {
            "Content-Type": "application/json",
            Authorization: token || auth(),
        },
    }).then((response) => {
        res = response.data;
        if (response.data.code < 20001 || response.data.code > 25000) throw response.data.message;
    });
    return res;
};

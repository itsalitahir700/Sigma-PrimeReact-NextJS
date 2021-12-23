import axios from "axios";
import { toast } from "react-toastify";
import { baseURL } from "../utils/constants";

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
            toast.success(response.data.message);
        })
        .catch((err) => {
            toast.warn(err || "Something went wrong");
        });
    return res;
};

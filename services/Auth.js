import axios from "axios";
import { toast } from "react-toastify";

export const login = async ({ username, password, deviceId }) => {
    let res = false;
    await axios({
        method: "post",
        url: `https://andrio.cba.com.pk/auth/authentication?password=${password}&username=${username}&deviceId=${deviceId}&application=CBA`,
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            toast.success(response.data.message);
            res = response.data.additionalDetail;
        })
        .catch((err) => {
            toast.warn(err.response.data.message || "Something went wrong");
        });
    return res;
};

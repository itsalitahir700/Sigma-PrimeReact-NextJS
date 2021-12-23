import axios from "axios";
import { toast } from "react-toastify";
import { auth, baseURL } from "../utils/constants";

export const utility = async () => {
    let res = false;
    await axios({
        url: `${baseURL}/billpayment/utility-company`,
        headers: { Authorization: auth },
    })
        .then((response) => {
            res = response.data.additionalDetail;
        })
        .catch((err) => {
            toast.warn(err || "Something went wrong");
        });
    return res;
};

import axios from "axios";
import { toast } from "react-toastify";
import { auth, baseURL } from "../utils/constants";

export const billInfo = async (bills) => {
    let res = false;
    await axios({
        url: `${baseURL}/billpayment/view-bill-info/view-nadra-bulk-bill-info
        `,
        method: "POST",
        data: bills,
        headers: { Authorization: auth() },
    })
        .then((response) => {
            res = response.data;
        })
        .catch((err) => {
            toast.warn(err?.message || "Something went wrong");
        });
    return res;
};

export const payBill = async (bills) => {
    let res = false;
    await axios({
        url: `${baseURL}/billpayment/bill-payment/perform-bulk-nadra-bill-payment
        `,
        method: "POST",
        data: bills,
        headers: { Authorization: auth() },
    })
        .then((response) => {
            res = response.data;
            if (response.data[0].code < 1 || response.data[0].code > 5000) throw response.data[0].message;
            toast.success(response.data.message);
        })
        .catch((err) => {
            toast.warn(err?.message || err || "Something went wrong");
        });
    return res;
};

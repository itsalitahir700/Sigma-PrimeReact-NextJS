import { baseURL } from "../utils/constants";
import axios from "axios";
import { toast } from "react-toastify";
import { SETLOADING } from "../redux/slices/loadingSlice";
import store from "../redux/store";

export const handlePutRequest = async (data, url) => {
    store.dispatch(SETLOADING(true));
    try {
        const response = await axios({
            method: "put",
            url: `${baseURL + url}`,
            data: data,
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token"),
            },
        });
        toast.success(response?.data?.messages);
        store.dispatch(SETLOADING(false));
        return response?.data;
    } catch (error) {
        toast.warn(error?.response?.data?.messages || "Something went wrong !!");
        store.dispatch(SETLOADING(false));
        return error?.response;
    }
};

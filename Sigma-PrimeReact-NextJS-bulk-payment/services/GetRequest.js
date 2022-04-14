import { baseURL } from "../utils/constants";
import axios from "axios";
import { toast } from "react-toastify";
import { SETLOADING } from "../redux/slices/loadingSlice";
import store from "../redux/store";

export const handleGetRequest = async (url) => {
    store.dispatch(SETLOADING(true));
    try {
        const response = await axios({
            method: "get",
            url: `${baseURL + url}`,
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

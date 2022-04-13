import Cookies from "js-cookie";

export const baseURL = `https://andrio.cba.com.pk`;
export const auth = () => {
    return Cookies.get("auth") ? `Bearer ${JSON.parse(Cookies.get("auth"))?.access_token}` : `Bearer ${JSON.parse(localStorage.getItem("auth"))?.access_token}`;
};

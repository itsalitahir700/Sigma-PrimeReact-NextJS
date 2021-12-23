import Cookies from "js-cookie";

export const auth = `Bearer ${JSON.parse(Cookies.get("auth")).access_token}`;
export const baseURL = `https://andrio.cba.com.pk`;

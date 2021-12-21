import { login } from "../../services/Auth";
import { LOGIN_SUCCESS, LOGIN_ERROR } from "../slices/authenticationSlice";
import Cookies from "js-cookie";

export const loginAction = (authData) => async (dispatch) => {
    const res = await login(authData);
    if (res) {
        dispatch(LOGIN_SUCCESS(res));
        Cookies.set("auth", JSON.stringify(res));
    } else {
        dispatch(LOGIN_ERROR("Error"));
    }
    return res;
};

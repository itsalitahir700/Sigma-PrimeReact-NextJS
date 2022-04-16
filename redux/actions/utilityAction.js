import { utility } from "../../services/Utiltity";
import { UTILITY_ERROR, UTILITY_SUCCESS } from "../slices/utilitySlice";

export const utilityCompany = () => async (dispatch) => {
    const res = await utility();
    if (res) {
        dispatch(UTILITY_SUCCESS(res));
    } else {
        dispatch(UTILITY_ERROR("Error"));
    }
    return res;
};

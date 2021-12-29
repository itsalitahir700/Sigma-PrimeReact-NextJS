import { billInfo, payBill } from "../../services/Bill";
import { BILL_ERROR, BILL_SUCCESS } from "../slices/billSlice";
import { PAID_BILL_ERROR, PAID_BILL_SUCCESS } from "../slices/paidBillSlice";

export const viewBillInfo = (bills) => async (dispatch) => {
    const res = await billInfo(bills);
    if (res) {
        dispatch(BILL_SUCCESS(res));
    } else {
        dispatch(BILL_ERROR("Error"));
    }
    return res;
};

export const payBulkBill = (bills) => async (dispatch) => {
    const res = await payBill(bills);
    if (res) {
        dispatch(PAID_BILL_SUCCESS(res));
    } else {
        dispatch(PAID_BILL_ERROR("Error"));
    }
    return res;
};

/* eslint-disable react-hooks/exhaustive-deps */
import LayoutCard from "../src/layout";
// import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { utilityCompany } from "../redux/actions/utilityAction";
import { useDispatch, useSelector } from "react-redux";
import { cloneDeep, groupBy } from "lodash";
import { payBulkBill, viewBillInfo } from "../redux/actions/billAction";
import { toast } from "react-toastify";
import * as cookie from "cookie";
import { getWallet } from "../redux/actions/authAction";
import { motion } from "framer-motion";
import { confirmPopup } from "primereact/confirmpopup";
import { wallet } from "../services/Auth";

function BulkPayment() {
    const rows = [...Array(20)];
    const initialState = rows.map((_item) => {
        return { shortName: "", amount: 0, utility: "", status: false, dueDate: "", mobileNo: "", consumerNumber: "", error: false, isDuplicate: false };
    });
    const dispatch = useDispatch();
    // const [checked, setChecked] = useState(false);
    const [state, setState] = useState(initialState);
    const [utilities, setUtilities] = useState([]);
    const [groupedUtilities, setGroupedUtilities] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loadingIcon, setloadingIcon] = useState(null);
    // const [billError, setBillError] = useState(true);
    const [billSummary, setBillSummary] = useState(null);
    const { utilitySlice, billSlice } = useSelector((state) => state);
    const { authenticationSlice } = useSelector((state) => state);
    const { paidBillSlice } = useSelector((state) => state);
    const [changed, setChanged] = useState(false);

    const updateState = (val, idx, key, flag = true) => {
        const newState = [...state];
        if (key === "shortName" && flag) {
            newState.forEach((item, index) => {
                // updateState(newState[0].utility, idx, "utility");
                if (index >= idx) {
                    newState[index][key] = val;
                    newState[index].utility = newState[idx].utility;
                }
            });
        }
        newState[idx][key] = val;
        newState[idx] = { ...newState[idx], amount: null, dueDate: "", beforeDueDate: "", afterDueDate: "", error: false, status: false, billMonth: null };

        newState[idx] = activeStatus(newState[idx]);

        setState(newState);
        setChanged(true);
    };

    const getUtility = async () => {
        await dispatch(utilityCompany());
    };

    const getBillInfo = async () => {
        setloadingIcon("pi pi-spin pi-spinner");
        setBillSummary(null);
        const stateData = cloneDeep(state);
        const filteredState = [];
        let duplicates = [];

        for (let index = 0; index < stateData.length; index++) {
            const { shortName, consumerNumber } = stateData[index];
            duplicates =
                filteredState.length &&
                filteredState.filter((filteredItem) => {
                    if (filteredItem.consumerNumber === consumerNumber && filteredItem.shortName === shortName) return filteredItem;
                    return null;
                });
            if (duplicates && duplicates.length) {
                break;
            }
            if (shortName && consumerNumber && !duplicates.length) {
                filteredState.push({ shortName, consumerNumber });
            }
        }

        if (duplicates.length) {
            const newState = stateData.map((item) => {
                if (item.consumerNumber === duplicates[0].consumerNumber && item.shortName === duplicates[0].shortName) {
                    item.isDuplicate = true;
                }
                return item;
            });
            setState(newState);
            setloadingIcon(null);
            toast.warn("Duplicate bills found");
            return;
        }
        const newState = stateData.map((item) => {
            item.isDuplicate = false;
            return item;
        });
        setState(newState);

        if (hasEmptyBills(stateData)) {
            setloadingIcon(null);
            toast.warn("No bills to fetch");
            return;
        }
        // console.log(filteredState);
        await dispatch(viewBillInfo(filteredState));
        setloadingIcon(null);
    };

    const getCurrentUtility = (shortName) => {
        return utilitySlice.find((item) => item.shortName === shortName);
    };

    const hasEmptyBills = (bills) => {
        const hasBills = bills.find((bill) => {
            return bill.shortName && bill.consumerNumber;
        });
        return !!!hasBills;
    };

    const payBill = async () => {
        // setChanged(false);
        setloadingIcon("pi pi-spin pi-spinner");
        const stateData = cloneDeep(state);
        const userData = cloneDeep(authenticationSlice);
        console.log("bills", stateData);
        let bills = [];
        stateData.forEach((item) => {
            if (item.amount) {
                const bill = {
                    accountId: userData.accountId,
                    amount: item.amount,
                    billingMonth: item.billMonth,
                    lat: "0",
                    lng: "0",
                    refTo: `${item.shortName}-${item.consumerNumber}`,
                    retailerRefNumber: "MOBILE",
                    serviceId: getCurrentUtility(item.shortName).serviceId,
                    serviceProvider: "NADRA",
                };

                bills.push(bill);
            }
        });
        if (bills.length === 0) {
            setloadingIcon(null);
            toast.warn("No bills to pay");
            return;
        }
        await dispatch(payBulkBill(bills));
        setloadingIcon(null);
        await getWallet(null, dispatch);
    };

    const generateUtility = () => {
        const utilityData = cloneDeep(utilitySlice);
        const groupedUtilities = groupBy(utilityData, (item) => item.type);
        setGroupedUtilities(groupedUtilities);
        setUtilities(
            Object.keys(groupedUtilities).map((item) => {
                return { label: item, value: item };
            })
        );
    };

    const getCompaniesByUtility = (utility, idx, flag = true) => {
        if (flag) updateState("", idx, "shortName", false);
        const groupedUtilitiesData = cloneDeep(groupedUtilities);
        const companyNames = groupedUtilitiesData[utility].map((item) => {
            return { label: item.shortName, value: item.shortName };
        });
        const companiesData = cloneDeep(companies);

        // if (!companiesData.length && !idx) {
        state.forEach((_item, index) => {
            if (index >= idx) companiesData[index] = companyNames;
        });
        // } else companiesData[idx] = companyNames;

        setCompanies(companiesData);
    };

    const activeStatus = (state) => {
        const { shortName, utility, consumerNumber } = state;
        if (shortName && utility && consumerNumber) {
            return { ...state, status: true };
        }
        return { ...state, status: false };
    };

    const resetRow = (idx = null, event) => {
        if (idx === null) {
            confirmPopup({
                target: event.currentTarget,
                message: "Are you sure you want to clear all inputs?",
                icon: "pi pi-info-circle p-button-danger",
                acceptClassName: "p-button-danger",
                accept: () => setState(initialState),
            });
            return;
        }
        const newState = cloneDeep(state);
        newState[idx] = { shortName: "", amount: 0, utility: "", status: false, dueDate: "", mobileNo: "", consumerNumber: "", error: false, isDuplicate: false };
        setState(newState);
    };

    const updateBillInfo = () => {
        setChanged(false);
        const stateData = cloneDeep(state);
        const filteredState = [];
        stateData.forEach((item) => {
            billSlice.forEach((bill) => {
                if (bill.additionalDetail.bill && item.consumerNumber === bill.additionalDetail.bill.consumerNo) {
                    item.dueDate = bill.additionalDetail.bill.dueDate || null;
                    item.amount = bill.additionalDetail.bill.billAmount || null;
                    item.beforeDueDate = bill.additionalDetail.bill.amountToBePaid || null;
                    item.afterDueDate = bill.additionalDetail.bill.lateAmount || null;
                    item.billMonth = bill.additionalDetail.bill.billMonth || null;
                    item.error = bill.code > 5000 || bill.code === 0 ? bill.message : false;
                } else if (item.consumerNumber === bill.additionalDetail.consumerNumber) {
                    item.error = bill.code > 5000 || bill.code === 0 ? bill.message : false;
                    item.dueDate = null;
                    item.amount = null;
                    item.beforeDueDate = null;
                    item.afterDueDate = null;
                    item.billMonth = null;
                }
            });
            filteredState.push(item);
        });
        const hasError = !stateData.every((item) => !item.error);
        if (hasError) {
            toast.warn("Please correct the errors");
        }
        setState(filteredState);
    };

    const updatePaidBillInfo = async () => {
        const stateData = cloneDeep(state);
        let billsTotal = { total: stateData.filter((item) => item?.status).length, success: 0, failed: 0, amount: 0 };
        const newState = [];
        stateData.forEach((item, index) => {
            let newObj = { ...item };
            if (item.shortName && item.consumerNumber && item.amount) {
                if (paidBillSlice[index] && paidBillSlice[index].code > 0 && paidBillSlice[index].code < 5001) {
                    billsTotal.success = billsTotal.success + 1;
                    billsTotal.amount = billsTotal.amount + paidBillSlice[index].additionalDetail.amount;
                } else {
                    billsTotal.failed = billsTotal.failed + 1;
                }
                if (paidBillSlice[index] && "additionalDetail" in paidBillSlice[index]) {
                    newObj.additionalDetail = paidBillSlice[index]?.additionalDetail;
                }
            }
            newState.push(newObj);
        });
        setBillSummary(billsTotal);
        setState(newState);
    };

    useEffect(() => {
        async function wallet() {
            await getWallet(null, dispatch);
        }
        wallet();
    }, []);

    useEffect(() => {
        getUtility();
    }, []);

    useEffect(() => {
        if (utilitySlice) generateUtility();
    }, [utilitySlice]);

    useEffect(() => {
        // setChecked(state.every((item) => item.status));
    }, [state]);

    useEffect(() => {
        if (billSlice && billSlice.length) updateBillInfo();
    }, [billSlice]);

    useEffect(() => {
        if (paidBillSlice && paidBillSlice.length) updatePaidBillInfo();
    }, [paidBillSlice]);

    return (
        <LayoutCard>
            {!changed ? (
                <motion.div key={billSummary} initial={{ y: 30, opacity: 0 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <div className="p-d-flex p-jc-between">
                        <div>
                            <h5 className="text-primary ">Fetch Summary</h5>
                        </div>
                        <Button label="Reset" className="p-button-sm" onClick={() => (window.location.href = "/BulkPayment")} />
                    </div>
                    <div className="p-grid p-py-1 bg-grey">
                        <div className="p-col-3 ">Total</div>
                        <div className="p-col-2">{billSummary?.total || "-"}</div>
                    </div>
                    <div className="p-grid p-py-1 ">
                        <div className="p-col-3">Fetched</div>
                        <div className="p-col-2">{billSummary?.success || "-"}</div>
                    </div>
                    <div className="p-grid p-py-1 ">
                        <div className="p-col-3">Total Paybale Amount</div>
                        <div className="p-col-2">Rs. {billSummary?.amount || "-"}</div>
                    </div>
                </motion.div>
            ) : null}

            {billSummary && !changed ? (
                <motion.div key={billSummary} initial={{ y: 30, opacity: 0 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <div className="p-d-flex p-jc-between">
                        <div>
                            <h5 className="text-primary ">Bill Summary</h5>
                        </div>
                        <Button label="Reset" className="p-button-sm" onClick={() => (window.location.href = "/BulkPayment")} />
                    </div>
                    <div className="p-grid p-py-1 bg-grey">
                        <div className="p-col-3 ">Total</div>
                        <div className="p-col-2">{billSummary?.total || "-"}</div>
                    </div>
                    <div className="p-grid p-py-1 ">
                        <div className="p-col-3">Success</div>
                        <div className="p-col-2">{billSummary?.success || "-"}</div>
                    </div>
                    <div className="p-grid p-py-1 bg-grey">
                        <div className="p-col-3">Fail</div>
                        <div className="p-col-2">{billSummary?.failed || "-"}</div>
                    </div>
                    <div className="p-grid p-py-1 ">
                        <div className="p-col-3">Total Amount Paid</div>
                        <div className="p-col-2">Rs. {billSummary?.amount || "-"}</div>
                    </div>
                </motion.div>
            ) : null}
            <motion.div key={billSummary} initial={{ y: -30, opacity: 0 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="Table p-mt-4">
                <div className="Table-row Table-header">
                    <div className="Table-row-item">
                        <Button icon="pi pi-times" tooltip="Reset All" onClick={(e) => resetRow(null, e)} className="p-button-rounded p-button-danger p-button-text" />

                        {/* <Checkbox disabled checked={checked}></Checkbox> */}
                    </div>
                    <div className="Table-row-item">Utility</div>
                    <div className="Table-row-item">Company</div>
                    <div className="Table-row-item">Consumer No</div>
                    <div className="Table-row-item">{state.some((item) => item.additionalDetail) ? "Transaction Id" : "Mobile No"}</div>
                    <div className="Table-row-item">Amount Payable</div>
                    <div className="Table-row-item">{state.some((item) => item.additionalDetail) ? "Status" : "Due Date"}</div>
                    <div className="Table-row-item">Message</div>
                    {/* <div className="Table-row-item">Before Due Date</div>
                    <div className="Table-row-item">After Due Date</div> */}
                </div>
                <div className="row-collection p-mt-4">
                    {rows.map((_item, idx) => (
                        <div className={state[idx]?.isDuplicate ? "duplicate-row Table-row" : state[idx]?.error ? "error-row Table-row" : "Table-row"} key={idx}>
                            <div className="Table-row-item" data-header="Status">
                                <Button icon="pi pi-times" tooltip="Reset Row" onClick={() => resetRow(idx)} className="p-button-rounded p-button-danger p-button-text" />
                                {/* {!changed && state[idx]?.additionalDetail?.transactionStatus?.toLowerCase() === "success" ? (
                                    <i style={{ fontSize: "1.4em" }} className="pi pi-check-square icon-success" />
                                ) : state[idx]?.error && !changed ? (
                                    <i style={{ fontSize: "1.4em" }} className="pi pi-exclamation-triangle icon-warn" popupTitle={state[idx].error} />
                                ) : (
                                    <Checkbox disabled onChange={(e) => updateState(e.checked, idx, "status")} checked={state[idx]?.status || false}></Checkbox>
                                )} */}
                            </div>
                            <div className="Table-row-item" data-header="Utility">
                                <Dropdown
                                    value={state[idx]?.utility || false}
                                    // disabled={billSummary}
                                    onChange={(e) => {
                                        updateState(e.value, idx, "utility");
                                        getCompaniesByUtility(e.value, idx);
                                    }}
                                    options={utilities}
                                />
                            </div>
                            <div className="Table-row-item" data-header="Company">
                                <Dropdown
                                    value={state[idx]?.shortName || false}
                                    // disabled={!state[idx]?.utility || billSummary}
                                    onChange={(e) => {
                                        updateState(e.value, idx, "shortName");
                                        getCompaniesByUtility(state[idx]?.utility, idx, false);
                                    }}
                                    options={companies[idx]}
                                />
                            </div>
                            <div className="Table-row-item" data-header="Consumer No">
                                <InputText
                                    // disabled={billSummary}
                                    onChange={(e) => {
                                        updateState(e.target.value, idx, "consumerNumber");
                                    }}
                                    value={state[idx]?.consumerNumber || ""}
                                />
                            </div>
                            <div className="Table-row-item" data-header="Mobile No">
                                {state[idx]?.additionalDetail?.id ? (
                                    state[idx]?.additionalDetail?.id
                                ) : (
                                    <InputText
                                        // disabled={billSummary}
                                        onChange={(e) => {
                                            updateState(e.target.value, idx, "mobileNo");
                                        }}
                                        value={state[idx]?.mobileNo || ""}
                                    />
                                )}
                            </div>
                            <div className="Table-row-item" data-header="Amount">
                                {state[idx]?.amount || "-"}
                            </div>
                            <div className="Table-row-item" data-header="Due Date">
                                {state[idx]?.additionalDetail?.transactionStatus ? (
                                    <span className={state[idx]?.additionalDetail?.transactionStatus?.toLowerCase() === "success" ? "text-success" : "text-warn"}>{state[idx]?.additionalDetail?.transactionStatus?.toLowerCase() === "success" ? "Paid" : "-"}</span>
                                ) : (
                                    state[idx]?.dueDate || "-"
                                )}
                            </div>
                            <div className="Table-row-item">
                                <small>{state[idx].error || (state[idx].isDuplicate && "Duplicate Entry")}</small>
                            </div>
                            {/* <div className="Table-row-item" data-header="Before Due Date">
                                {state[idx]?.beforeDueDate || "-"}
                            </div>
                            <div className="Table-row-item" data-header="After Due Date">
                                {state[idx]?.afterDueDate || "-"}
                            </div> */}
                        </div>
                    ))}
                </div>
            </motion.div>
            {!billSummary || changed ? (
                <div className="p-mt-4">
                    {!billSlice.length || changed ? <Button label="Fetch" onClick={getBillInfo} icon={loadingIcon || ""} iconPos="right" disabled={loadingIcon} /> : <Button label="Pay Bill" onClick={payBill} icon={loadingIcon || ""} iconPos="right" disabled={loadingIcon} />}
                </div>
            ) : null}
        </LayoutCard>
    );
}

export default BulkPayment;

export async function getServerSideProps(context) {
    const { req } = context;
    const { auth } = cookie.parse(req ? req.headers.cookie || "" : document.cookie);
    if (!auth) {
        return {
            redirect: {
                permanent: false,
                destination: "/Login",
            },
        };
    }

    return { props: {} };
}

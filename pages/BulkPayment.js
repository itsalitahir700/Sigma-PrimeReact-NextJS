/* eslint-disable react-hooks/exhaustive-deps */
import LayoutCard from "../src/layout";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { utilityCompany } from "../redux/actions/utilityAction";
import { useDispatch, useSelector } from "react-redux";
import { cloneDeep, groupBy } from "lodash";

function BulkPayment() {
    const dispatch = useDispatch();
    const [checked, setChecked] = useState(false);
    const [state, setState] = useState(
        [...Array(20)].map((_item) => {
            return { company: "", amount: 0, utility: "", status: false, dueDate: "", mobileNo: "", consumerNo: "" };
        })
    );

    const [utilities, setUtilities] = useState([]);
    const [groupedUtilities, setGroupedUtilities] = useState([]);
    const [companies, setCompanies] = useState([]);
    const { utilitySlice } = useSelector((state) => state);

    const updateState = (val, idx, key) => {
        const newState = [...state];
        newState[idx][key] = val;
        newState[idx] = activeStatus(newState[idx]);
        setState(newState);
    };

    const getUtility = async () => {
        await dispatch(utilityCompany());
    };

    const generateUtility = () => {
        const utilityData = cloneDeep(utilitySlice);
        const groupedUtilities = groupBy(utilityData, (item) => item.type);
        setGroupedUtilities(groupedUtilities);
        setUtilities(Object.keys(groupedUtilities));
    };

    const getCompaniesByUtility = (utility, idx) => {
        updateState("", idx, "company");
        const groupedUtilitiesData = cloneDeep(groupedUtilities);
        const companyNames = groupedUtilitiesData[utility].map((item) => item.shortName);
        const companiesData = cloneDeep(companies);
        companiesData[idx] = companyNames;
        setCompanies(companiesData);
    };

    const activeStatus = (state) => {
        const { company, utility, consumerNo } = state;
        if (company && utility && consumerNo) {
            return { ...state, status: true };
        }
        return { ...state, status: false };
    };

    useEffect(() => {
        getUtility();
    }, []);

    useEffect(() => {
        if (utilitySlice) generateUtility();
    }, [utilitySlice]);

    return (
        <LayoutCard>
            <div className="Table">
                <div className="Table-row Table-header">
                    <div className="Table-row-item">
                        <Checkbox disabled onChange={(e) => setChecked(e.checked)} checked={checked}></Checkbox>
                    </div>
                    <div className="Table-row-item">Utility</div>
                    <div className="Table-row-item">Company</div>
                    <div className="Table-row-item">Consumer No</div>
                    <div className="Table-row-item">Mobile No</div>
                    <div className="Table-row-item">Amount</div>
                    <div className="Table-row-item">Due Date</div>
                </div>
                <div className="row-collection p-mt-4">
                    {[...Array(20)].map((_item, idx) => (
                        <div className="Table-row" key={idx}>
                            <div className="Table-row-item" data-header="Action">
                                <Checkbox disabled onChange={(e) => updateState(e.checked, idx, "status")} checked={state[idx]?.status || false}></Checkbox>
                            </div>
                            <div className="Table-row-item" data-header="Utility">
                                <Dropdown
                                    value={state[idx]?.utility || false}
                                    onChange={(e) => {
                                        updateState(e.value, idx, "utility");
                                        getCompaniesByUtility(e.value, idx);
                                    }}
                                    options={utilities}
                                />
                            </div>
                            <div className="Table-row-item" data-header="OS">
                                <Dropdown
                                    value={state[idx]?.company || false}
                                    disabled={!state[idx]?.utility}
                                    onChange={(e) => {
                                        updateState(e.value, idx, "company");
                                    }}
                                    options={companies[idx]}
                                />
                            </div>
                            <div className="Table-row-item" data-header="Country">
                                <InputText
                                    onChange={(e) => {
                                        updateState(e.target.value, idx, "consumerNo");
                                    }}
                                    value={state[idx]?.consumerNo || ""}
                                />
                            </div>
                            <div className="Table-row-item" data-header="Uploaded on">
                                <InputText
                                    onChange={(e) => {
                                        updateState(e.target.value, idx, "mobileNo");
                                    }}
                                    value={state[idx]?.mobileNo || ""}
                                />
                            </div>
                            <div className="Table-row-item" data-header="Length">
                                -
                            </div>
                            <div className="Table-row-item" data-header="Length">
                                -
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="p-mt-4">
                <Button label="Fetch" />
            </div>
        </LayoutCard>
    );
}

export default BulkPayment;
